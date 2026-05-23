import { Layout } from "@/components/Layout";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2, ChevronRight, ChevronLeft,
  User, MapPin, Truck, CreditCard, ClipboardList,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { buildWhatsAppOrderMessage, openWhatsAppOrder } from "@/lib/whatsapp";
import type { CartItem } from "@/hooks/useCart";

// ─── Zod schemas per step ────────────────────────────────────────────────────

const customerSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب (حرفان على الأقل)"),
  phone: z
    .string()
    .min(10, "رقم الجوال يجب أن يكون 10 أرقام على الأقل")
    .regex(/^[0-9+\s-]+$/, "رقم الجوال غير صحيح"),
  email: z.union([z.literal(""), z.string().email("صيغة البريد الإلكتروني غير صحيحة")]),
});

const addressSchema = z.object({
  region: z.string().min(1, "المنطقة مطلوبة"),
  city: z.string().min(2, "المدينة مطلوبة"),
  neighborhood: z.string().min(2, "الحي مطلوب"),
  detailedAddress: z.string().min(5, "العنوان التفصيلي مطلوب"),
  nationalAddress: z.string().min(4, "العنوان الوطني مطلوب"),
  postalCode: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["bank_transfer"] as const, {
    errorMap: () => ({ message: "يرجى اختيار طريقة الدفع" }),
  }),
});

const fullSchema = customerSchema.merge(addressSchema).merge(paymentSchema);

type CheckoutForm = z.infer<typeof fullSchema>;

// Fields validated on "Next" per step (step 3 is informational, no required fields)
const STEP_FIELDS: Record<number, (keyof CheckoutForm)[]> = {
  1: ["name", "phone", "email"],
  2: ["region", "city", "neighborhood", "detailedAddress", "nationalAddress"],
  3: [],
  4: ["paymentMethod"],
};

// ─── Static data ─────────────────────────────────────────────────────────────

const SAUDI_REGIONS = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "المنطقة الشرقية",
  "القصيم",
  "عسير",
  "تبوك",
  "حائل",
  "جازان",
  "نجران",
  "الباحة",
  "الجوف",
  "الحدود الشمالية",
];

const PAYMENT_OPTIONS = [
  {
    id: "bank_transfer" as const,
    name: "تحويل بنكي",
    subtitle: "سيتم إرسال تفاصيل التحويل بعد تأكيد الطلب",
    disabled: false,
  },
  {
    id: "mada" as const,
    name: "مدى",
    subtitle: "بطاقة مدى أو ائتمانية",
    disabled: true,
  },
  {
    id: "apple_pay" as const,
    name: "Apple Pay",
    subtitle: "الدفع عبر Apple Pay",
    disabled: true,
  },
  {
    id: "google_pay" as const,
    name: "Google Pay",
    subtitle: "الدفع عبر Google Pay",
    disabled: true,
  },
] as const;

const STEPS = [
  { id: 1, label: "معلومات العميل", Icon: User },
  { id: 2, label: "العنوان", Icon: MapPin },
  { id: 3, label: "الشحن", Icon: Truck },
  { id: 4, label: "الدفع", Icon: CreditCard },
  { id: 5, label: "المراجعة", Icon: ClipboardList },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSupplierNameFromItem(item: CartItem): string {
  const p = item.product as CartItem["product"] & { supplier_name?: string };
  return p.supplierName?.trim() || p.supplier_name?.trim() || "مورد غير محدد";
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Checkout() {
  const { cart, loading: cartLoading } = useCart();
  const [step, setStep] = useState(1);
  const [supplierCities, setSupplierCities] = useState<Record<string, string>>({});

  const {
    register,
    formState: { errors },
    watch,
    trigger,
    getValues,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      paymentMethod: "bank_transfer",
      region: "",
      email: "",
      postalCode: "",
      notes: "",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const customerCity = watch("city") ?? "";

  // Unique supplier names from cart
  const supplierNames = useMemo(() => {
    const names = new Set<string>();
    for (const item of cart?.items ?? []) {
      names.add(getSupplierNameFromItem(item));
    }
    return [...names];
  }, [cart?.items]);

  // Fetch supplier cities when entering step 3
  useEffect(() => {
    if (step !== 3 || supplierNames.length === 0) return;
    supabase
      .from("suppliers")
      .select("name, city")
      .in("name", supplierNames)
      .then(({ data }) => {
        const map: Record<string, string> = {};
        for (const s of data ?? []) {
          if (s.name && s.city) map[s.name] = s.city;
        }
        setSupplierCities(map);
      });
  }, [step]);

  // Per-supplier shipping: same city = 20 SAR, different/unknown = 30 SAR
  const shippingMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const name of supplierNames) {
      const supCity = (supplierCities[name] ?? "").trim();
      const custCity = customerCity.trim();
      map[name] = supCity && custCity && supCity === custCity ? 20 : 30;
    }
    return map;
  }, [supplierNames, supplierCities, customerCity]);

  const subtotal = cart?.total ?? 0;
  const shippingPrice = Object.values(shippingMap).reduce((a, b) => a + b, 0);
  const total = subtotal + shippingPrice;

  const selectedPaymentLabel =
    PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.name ?? "—";

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    if (fields && fields.length > 0) {
      const valid = await trigger(fields as any);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhatsAppSubmit = () => {
    const values = getValues();
    const cityAddress = [values.city, values.neighborhood, values.detailedAddress]
      .filter(Boolean)
      .join("، ");

    const message = buildWhatsAppOrderMessage(
      cart?.items ?? [],
      {
        name: values.name?.trim() || "غير محدد",
        phone: values.phone?.trim() || "غير محدد",
        cityAddress,
        notes: values.notes?.trim(),
      },
      shippingMap,
      values.paymentMethod
    );

    openWhatsAppOrder(message);
  };

  if (cartLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center text-muted-foreground">
          جاري تحميل السلة...
        </div>
      </Layout>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <Layout>
        <div dir="rtl" className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-2xl font-bold mb-6">السلة فارغة</p>
          <Link href="/products">
            <Button size="lg">تصفح المنتجات</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <Layout>
      <div dir="rtl" className="max-w-2xl mx-auto px-4 py-10">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">إتمام الطلب</h1>
          <p className="text-muted-foreground text-sm mt-1">أكمل بياناتك لتأكيد طلبك</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-start justify-between mb-10 relative">
          <div className="absolute top-5 right-5 left-5 h-0.5 bg-white/10 z-0" />

          {STEPS.map((s) => {
            const Icon = s.Icon;
            const done = step > s.id;
            const active = step === s.id;

            return (
              <div key={s.id} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                <div
                  className={`absolute top-5 h-0.5 transition-all duration-300 ${done ? "bg-primary" : "bg-transparent"}`}
                  style={{
                    right: `${((s.id - 1) / (STEPS.length - 1)) * 100}%`,
                    width: `${(1 / (STEPS.length - 1)) * 100}%`,
                    transform: "translateX(50%)",
                  }}
                />
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                    done
                      ? "bg-primary border-primary"
                      : active
                      ? "bg-primary/20 border-primary"
                      : "bg-background border-white/15"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>
                <span
                  className={`text-xs font-bold text-center leading-tight hidden sm:block ${
                    active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ─── Form ─────────────────────────────────────────────────────────── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 5) handleWhatsAppSubmit();
          }}
          noValidate
        >

          {/* STEP 1 – Customer Info */}
          {step === 1 && (
            <div className="glass-panel rounded-2xl p-6 space-y-5 animate-in fade-in duration-300">
              <SectionHeader icon={<User className="w-5 h-5 text-primary" />} title="معلومات العميل" />

              <Field label="الاسم الكامل" required error={errors.name?.message}>
                <Input {...register("name")} placeholder="محمد عبدالله" />
              </Field>

              <Field label="رقم الجوال" required error={errors.phone?.message}>
                <Input
                  {...register("phone")}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="text-right"
                  inputMode="tel"
                />
              </Field>

              <Field
                label="البريد الإلكتروني"
                optional
                error={errors.email?.message}
              >
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="example@email.com"
                  dir="ltr"
                  className="text-right"
                />
              </Field>
            </div>
          )}

          {/* STEP 2 – Address */}
          {step === 2 && (
            <div className="glass-panel rounded-2xl p-6 space-y-5 animate-in fade-in duration-300">
              <SectionHeader icon={<MapPin className="w-5 h-5 text-primary" />} title="عنوان التوصيل" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="المنطقة" required error={errors.region?.message}>
                  <select
                    {...register("region")}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">اختر المنطقة</option>
                    {SAUDI_REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </Field>

                <Field label="المدينة" required error={errors.city?.message}>
                  <Input {...register("city")} placeholder="الرياض" />
                </Field>
              </div>

              <Field label="الحي" required error={errors.neighborhood?.message}>
                <Input {...register("neighborhood")} placeholder="حي النزهة" />
              </Field>

              <Field label="العنوان التفصيلي" required error={errors.detailedAddress?.message}>
                <Input
                  {...register("detailedAddress")}
                  placeholder="شارع الأمير سلطان، مبنى 12، الدور 3"
                />
              </Field>

              <Field label="العنوان الوطني" required error={errors.nationalAddress?.message}>
                <Input
                  {...register("nationalAddress")}
                  placeholder="RIAD1234"
                  dir="ltr"
                  className="text-right"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="الرمز البريدي" optional>
                  <Input
                    {...register("postalCode")}
                    placeholder="12345"
                    dir="ltr"
                    className="text-right"
                    inputMode="numeric"
                  />
                </Field>

                <Field label="ملاحظات التوصيل" optional>
                  <Input
                    {...register("notes")}
                    placeholder="أي تعليمات للمندوب..."
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 3 – Shipping (auto-calculated per supplier) */}
          {step === 3 && (
            <div className="glass-panel rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
              <SectionHeader icon={<Truck className="w-5 h-5 text-primary" />} title="تفاصيل الشحن" />

              <p className="text-sm text-muted-foreground">
                رسوم الشحن تُحسَب تلقائياً لكل مورد بناءً على المدينة.
              </p>

              <div className="space-y-3">
                {supplierNames.map((name) => {
                  const supCity = supplierCities[name] ?? "";
                  const custCity = customerCity.trim();
                  const sameCity = supCity && custCity && supCity === custCity;
                  const fee = shippingMap[name] ?? 30;
                  return (
                    <div
                      key={name}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-background/30"
                    >
                      <div>
                        <p className="font-bold text-sm">{name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {supCity
                            ? sameCity
                              ? `نفس المدينة (${supCity})`
                              : `شحن خارج المدينة`
                            : "يتم تحديد المدينة تلقائياً"}
                        </p>
                      </div>
                      <p className="font-black text-primary text-base">{formatPrice(fee)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between text-sm font-bold">
                <span>إجمالي الشحن</span>
                <span className="text-primary">{formatPrice(shippingPrice)}</span>
              </div>
            </div>
          )}

          {/* STEP 4 – Payment */}
          {step === 4 && (
            <div className="glass-panel rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
              <SectionHeader icon={<CreditCard className="w-5 h-5 text-primary" />} title="طريقة الدفع" />

              <div className="space-y-3">
                {PAYMENT_OPTIONS.map((option) => {
                  const selected = !option.disabled && paymentMethod === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        option.disabled
                          ? "border-white/5 opacity-50 cursor-not-allowed"
                          : selected
                          ? "border-primary bg-primary/10 cursor-pointer"
                          : "border-white/10 hover:border-white/25 cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.id}
                        disabled={option.disabled}
                        {...(!option.disabled ? register("paymentMethod") : {})}
                        className="sr-only"
                      />
                      <RadioDot selected={selected} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{option.name}</p>
                          {option.disabled && (
                            <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                              قريباً
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{option.subtitle}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {errors.paymentMethod && (
                <p className="text-destructive text-xs">{errors.paymentMethod.message}</p>
              )}
            </div>
          )}

          {/* STEP 5 – Review & Confirm */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <SectionHeader
                  icon={<ClipboardList className="w-5 h-5 text-primary" />}
                  title="ملخص الطلب"
                />

                {/* Product list grouped by supplier — products only, no per-supplier totals */}
                <div className="space-y-5">
                  {supplierNames.map((supplierName) => {
                    const supplierItems = (cart.items ?? []).filter(
                      (item) => getSupplierNameFromItem(item) === supplierName
                    );
                    return (
                      <div key={supplierName} className="space-y-2">
                        <p className="text-xs text-primary/80 font-bold tracking-wide border-b border-white/10 pb-1">
                          المتجر: {supplierName}
                        </p>
                        {supplierItems.map((item) => (
                          <div key={item.productId} className="flex items-center gap-3">
                            <img
                              src={
                                item.product.imageUrl ||
                                "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&h=80&fit=crop"
                              }
                              className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                              alt={item.product.name}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                            </div>
                            <p className="font-bold text-primary text-sm whitespace-nowrap">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
                  <SummaryRow label="المجموع الفرعي" value={formatPrice(subtotal)} />
                  <SummaryRow label="إجمالي الشحن" value={formatPrice(shippingPrice)} />
                  <div className="flex justify-between text-muted-foreground">
                    <span>رسوم المنصة</span>
                    <span className="text-green-500 font-bold">مجاناً حالياً</span>
                  </div>
                  <SummaryRow label="طريقة الدفع" value={selectedPaymentLabel} />
                  <div className="flex justify-between font-black text-lg border-t border-white/10 pt-3">
                    <span>الإجمالي</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Discount code — placeholder, no backend */}
              <DiscountCodeBox />

              <Button
                type="button"
                size="lg"
                className="w-full h-14 text-lg shadow-lg shadow-primary/20"
                onClick={handleWhatsAppSubmit}
              >
                إرسال الطلب عبر واتساب
              </Button>
            </div>
          )}

          {/* Navigation buttons */}
          <div className={`flex gap-3 mt-6 ${step > 1 ? "justify-between" : "justify-end"}`}>
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={goPrev}
                className="flex items-center gap-2 px-5"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </Button>
            )}
            {step < 5 && (
              <Button
                type="button"
                onClick={goNext}
                className="flex items-center gap-2 px-8 h-12"
              >
                التالي
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}

// ─── Small sub-components ────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="text-xl font-bold flex items-center gap-2">
      {icon}
      {title}
    </h2>
  );
}

function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5">
        {label}{" "}
        {required && <span className="text-destructive">*</span>}
        {optional && (
          <span className="text-muted-foreground font-normal">(اختياري)</span>
        )}
      </label>
      {children}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? "border-primary" : "border-muted-foreground"
      }`}
    >
      {selected && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function DiscountCodeBox() {
  const [code, setCode] = useState("");
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3">
      <p className="text-sm font-bold">هل لديك كود خصم؟</p>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="أدخل الكود هنا"
          dir="ltr"
          className="flex-1 text-right tracking-widest"
        />
        <Button
          type="button"
          variant="outline"
          className="shrink-0 px-5 font-bold"
          onClick={() => {/* placeholder */}}
        >
          تطبيق
        </Button>
      </div>
    </div>
  );
}
