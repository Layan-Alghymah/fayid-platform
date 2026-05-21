import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2, ChevronRight, ChevronLeft,
  User, MapPin, Truck, CreditCard, ClipboardList,
  Package, Building2, Bike,
} from "lucide-react";

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

const shippingSchema = z.object({
  shippingMethod: z.string().min(1, "يرجى اختيار طريقة الشحن"),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(["mada", "tabby", "cod"] as const, {
    errorMap: () => ({ message: "يرجى اختيار طريقة الدفع" }),
  }),
});

const fullSchema = customerSchema
  .merge(addressSchema)
  .merge(shippingSchema)
  .merge(paymentSchema);

type CheckoutForm = z.infer<typeof fullSchema>;

// Fields validated on "Next" per step
const STEP_FIELDS: Record<number, (keyof CheckoutForm)[]> = {
  1: ["name", "phone", "email"],
  2: ["region", "city", "neighborhood", "detailedAddress", "nationalAddress"],
  3: ["shippingMethod"],
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

const SHIPPING_OPTIONS = [
  {
    id: "aramex",
    type: "company",
    name: "أرامكس",
    subtitle: "شحن سريع بضمان التوصيل",
    price: 25,
    deliveryTime: "2-3 أيام عمل",
    Icon: Building2,
  },
  {
    id: "smsa",
    type: "company",
    name: "SMSA سمسا",
    subtitle: "شحن موثوق في جميع المناطق",
    price: 20,
    deliveryTime: "2-4 أيام عمل",
    Icon: Package,
  },
  {
    id: "local",
    type: "local",
    name: "مندوب محلي",
    subtitle: "توصيل داخل نفس المدينة",
    price: 15,
    deliveryTime: "نفس اليوم أو اليوم التالي",
    Icon: Bike,
  },
] as const;

const PAYMENT_OPTIONS = [
  {
    id: "mada" as const,
    name: "مدى",
    subtitle: "بطاقة مدى أو بطاقة ائتمانية",
    Icon: CreditCard,
    badge: null,
  },
  {
    id: "tabby" as const,
    name: "تمارا / تمويلية",
    subtitle: "قسّط مشترياتك بدون فوائد",
    Icon: null,
    badge: "تمارا",
  },
  {
    id: "cod" as const,
    name: "الدفع عند الاستلام",
    subtitle: "ادفع نقداً عند استلام الطلب",
    Icon: Truck,
    badge: null,
  },
];

const STEPS = [
  { id: 1, label: "معلومات العميل", Icon: User },
  { id: 2, label: "العنوان", Icon: MapPin },
  { id: 3, label: "الشحن", Icon: Truck },
  { id: 4, label: "الدفع", Icon: CreditCard },
  { id: 5, label: "المراجعة", Icon: ClipboardList },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Checkout() {
  const { cart, loading: cartLoading } = useCart();
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();

  const {
    register,
    formState: { errors },
    watch,
    trigger,
    getValues,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(fullSchema),
    defaultValues: {
      paymentMethod: "mada",
      shippingMethod: "",
      region: "",
      email: "",
      postalCode: "",
      notes: "",
    },
  });

  const shippingMethod = watch("shippingMethod");
  const paymentMethod = watch("paymentMethod");
  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingMethod);
  const selectedPayment = PAYMENT_OPTIONS.find((p) => p.id === paymentMethod);

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    if (fields) {
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

  const subtotal = cart?.total ?? 0;
  const shippingPrice = selectedShipping?.price ?? 0;
  const total = subtotal + shippingPrice;

  const handleWhatsAppSubmit = () => {
    const phone = "966559433431";
    const values = getValues();
    const name = values.name?.trim() || "غير محدد";
    const customerPhone = values.phone?.trim() || "غير محدد";

    const productLines = (cart?.items ?? [])
      .map((item) => `• ${item?.product?.name ?? "منتج"} (الكمية: ${item?.quantity ?? 1})`)
      .join("\n");

    const message = [
      "طلب جديد من فائض",
      "",
      `الاسم: ${name}`,
      `الجوال: ${customerPhone}`,
      "",
      "المنتجات:",
      productLines,
      "",
      `الإجمالي: ${total} ر.س`,
    ].join("\n");

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = url;
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

          {/* STEP 3 – Shipping */}
          {step === 3 && (
            <div className="glass-panel rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
              <SectionHeader icon={<Truck className="w-5 h-5 text-primary" />} title="طريقة الشحن" />

              <GroupLabel>شركة شحن</GroupLabel>
              {SHIPPING_OPTIONS.filter((o) => o.type === "company").map((option) => (
                <ShippingCard
                  key={option.id}
                  option={option}
                  selected={shippingMethod === option.id}
                  register={register}
                />
              ))}

              <GroupLabel>مندوب محلي</GroupLabel>
              {SHIPPING_OPTIONS.filter((o) => o.type === "local").map((option) => (
                <ShippingCard
                  key={option.id}
                  option={option}
                  selected={shippingMethod === option.id}
                  register={register}
                />
              ))}

              {errors.shippingMethod && (
                <p className="text-destructive text-xs">{errors.shippingMethod.message}</p>
              )}
            </div>
          )}

          {/* STEP 4 – Payment */}
          {step === 4 && (
            <div className="glass-panel rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
              <SectionHeader icon={<CreditCard className="w-5 h-5 text-primary" />} title="طريقة الدفع" />

              <div className="space-y-3">
                {PAYMENT_OPTIONS.map((option) => {
                  const selected = paymentMethod === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selected
                          ? "border-primary bg-primary/10"
                          : "border-white/10 hover:border-white/25"
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.id}
                        {...register("paymentMethod")}
                        className="sr-only"
                      />
                      <RadioDot selected={selected} />

                      {option.badge ? (
                        <span
                          className={`text-sm font-black px-2 py-1 rounded-lg ${
                            selected
                              ? "text-primary bg-primary/20"
                              : "text-muted-foreground bg-white/5"
                          }`}
                        >
                          {option.badge}
                        </span>
                      ) : option.Icon ? (
                        <option.Icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            selected ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      ) : null}

                      <div className="flex-1">
                        <p className="font-bold text-sm">{option.name}</p>
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

                {/* Product list */}
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pl-1">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <img
                        src={
                          item.product.imageUrl ||
                          "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&h=80&fit=crop"
                        }
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        alt={item.product.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-primary text-sm whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
                  <SummaryRow label="المجموع الفرعي" value={formatPrice(subtotal)} />
                  <SummaryRow
                    label={`رسوم الشحن (${selectedShipping?.name ?? "—"})`}
                    value={shippingPrice > 0 ? formatPrice(shippingPrice) : "—"}
                  />
                  <SummaryRow
                    label="طريقة الدفع"
                    value={selectedPayment?.name ?? "—"}
                  />
                  <div className="flex justify-between font-black text-lg border-t border-white/10 pt-3">
                    <span>الإجمالي</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

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

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold pt-1">
      {children}
    </p>
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

function ShippingCard({
  option,
  selected,
  register,
}: {
  option: (typeof SHIPPING_OPTIONS)[number];
  selected: boolean;
  register: ReturnType<typeof useForm<CheckoutForm>>["register"];
}) {
  const { Icon } = option;
  return (
    <label
      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
        selected ? "border-primary bg-primary/10" : "border-white/10 hover:border-white/25"
      }`}
    >
      <input
        type="radio"
        value={option.id}
        {...register("shippingMethod")}
        className="sr-only"
      />
      <RadioDot selected={selected} />
      <Icon
        className={`w-6 h-6 flex-shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`}
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{option.name}</p>
        <p className="text-xs text-muted-foreground truncate">{option.subtitle}</p>
        <p className="text-xs text-muted-foreground mt-0.5">⏱ {option.deliveryTime}</p>
      </div>
      <div className="text-left flex-shrink-0">
        <p className={`font-black text-base ${selected ? "text-primary" : ""}`}>
          {formatPrice(option.price)}
        </p>
      </div>
    </label>
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
