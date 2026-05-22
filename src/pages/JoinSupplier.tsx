import { useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLogo } from "@/components/BrandLogo";
import { TermsModal } from "@/components/TermsModal";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";

// ─── Static options ────────────────────────────────────────────────────────────

const BUSINESS_TYPES = [
  "عبايات",
  "أقمشة",
  "ملابس",
  "مصنع",
  "متجر إلكتروني",
  "صالون / مشغل",
  "أخرى",
];

const PRODUCT_CATEGORIES = [
  "أقمشة",
  "عبايات",
  "ملابس",
  "إكسسوارات",
  "منتجات فائضة",
  "منتجات بتلف بسيط",
  "نهاية موسم",
];

const SURPLUS_TYPES = [
  "فائض مخزون",
  "نهاية موسم",
  "تلف بسيط من التصنيع",
  "عينات",
  "قطع محدودة",
  "أخرى",
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  store_name: string;
  contact_person: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  business_type: string;
  product_categories: string[];
  surplus_type: string[];
  estimated_quantity: string;
  instagram_url: string;
  website_url: string;
  notes: string;
  accept_terms: boolean;
}

const defaultForm: FormState = {
  store_name: "",
  contact_person: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "",
  business_type: "",
  product_categories: [],
  surplus_type: [],
  estimated_quantity: "",
  instagram_url: "",
  website_url: "",
  notes: "",
  accept_terms: false,
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function JoinSupplier() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [termsOpen, setTermsOpen] = useState(false);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const set = (field: keyof FormState, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const toggleMulti = (field: "product_categories" | "surplus_type", value: string) => {
    setForm((f) => {
      const arr = f[field] as string[];
      return {
        ...f,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  // ─── Validation ───────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.store_name.trim()) e.store_name = "اسم المتجر مطلوب";
    if (!form.contact_person.trim()) e.contact_person = "اسم المسؤول مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الجوال مطلوب";
    else if (!/^[0-9+\s-]{9,}$/.test(form.phone)) e.phone = "رقم الجوال غير صحيح";
    if (!form.email.trim()) e.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "البريد الإلكتروني غير صحيح";
    if (!form.city.trim()) e.city = "المدينة مطلوبة";
    if (!form.business_type) e.business_type = "نوع النشاط مطلوب";
    if (form.product_categories.length === 0) e.product_categories = "اختر فئة منتجات واحدة على الأقل";
    if (form.surplus_type.length === 0) e.surplus_type = "اختر نوع فائض واحد على الأقل";
    if (!form.accept_terms) e.accept_terms = "يجب الموافقة على الشروط للمتابعة";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);

    const payload = {
      store_name: form.store_name.trim(),
      contact_person: form.contact_person.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || null,
      email: form.email.trim(),
      city: form.city.trim(),
      business_type: form.business_type,
      product_categories: form.product_categories,
      surplus_type: form.surplus_type,
      estimated_quantity: form.estimated_quantity.trim() || null,
      instagram_url: form.instagram_url.trim() || null,
      website_url: form.website_url.trim() || null,
      notes: form.notes.trim() || null,
      status: "new",
    };

    const { error: insertError } = await supabase
      .from("supplier_requests")
      .insert(payload);

    if (insertError) {
      setSubmitError(`حدث خطأ أثناء الإرسال: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    // Fire-and-forget: call edge function for email notification.
    // Failure here does NOT block the user — data is already saved.
    supabase.functions
      .invoke("notify-supplier-request", { body: payload })
      .catch(() => {
        // Email notification failed silently — admin can view requests in Supabase dashboard
      });

    setSubmitting(false);
    setSubmitted(true);
  };

  // ─── Success screen ──────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div dir="rtl" className="min-h-screen bg-background flex flex-col">
        <PageHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="max-w-md w-full text-center glass-panel rounded-3xl p-10 space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold mb-2">تم إرسال طلبك بنجاح</h2>
              <p className="text-muted-foreground">
                سيتم التواصل معك من فريق فائض قريبًا
              </p>
            </div>
            <Link href="/">
              <Button size="lg" className="w-full gap-2">
                <Home className="w-5 h-5" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────────

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">
      <PageHeader />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold mb-2">انضم كمورد في فائض</h1>
          <p className="text-muted-foreground">
            أكمل النموذج التالي وسيتواصل معك فريقنا لاستكمال الإجراءات.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* ── Section 1: Basic Info ── */}
          <FormSection title="المعلومات الأساسية">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="اسم المتجر / الشركة" required error={errors.store_name}>
                <Input
                  value={form.store_name}
                  onChange={(e) => set("store_name", e.target.value)}
                  placeholder="متجر الأناقة"
                />
              </Field>
              <Field label="اسم المسؤول" required error={errors.contact_person}>
                <Input
                  value={form.contact_person}
                  onChange={(e) => set("contact_person", e.target.value)}
                  placeholder="محمد عبدالله"
                />
              </Field>
              <Field label="رقم الجوال" required error={errors.phone}>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  className="text-right"
                  inputMode="tel"
                />
              </Field>
              <Field label="واتساب" error={errors.whatsapp}>
                <Input
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="05xxxxxxxx (اختياري)"
                  dir="ltr"
                  className="text-right"
                  inputMode="tel"
                />
              </Field>
              <Field label="البريد الإلكتروني" required error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="store@example.com"
                  dir="ltr"
                  className="text-right"
                />
              </Field>
              <Field label="المدينة" required error={errors.city}>
                <Input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="الرياض"
                />
              </Field>
            </div>
          </FormSection>

          {/* ── Section 2: Business Type ── */}
          <FormSection title="نوع النشاط">
            <Field label="نوع النشاط التجاري" required error={errors.business_type}>
              <select
                value={form.business_type}
                onChange={(e) => set("business_type", e.target.value)}
                className="w-full bg-background/50 border border-border rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">اختر نوع النشاط</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </FormSection>

          {/* ── Section 3: Product Categories ── */}
          <FormSection title="فئات المنتجات">
            <Field label="ما هي فئات منتجاتك؟" required error={errors.product_categories}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                {PRODUCT_CATEGORIES.map((cat) => (
                  <CheckOption
                    key={cat}
                    label={cat}
                    checked={form.product_categories.includes(cat)}
                    onChange={() => toggleMulti("product_categories", cat)}
                  />
                ))}
              </div>
            </Field>
          </FormSection>

          {/* ── Section 4: Surplus Type ── */}
          <FormSection title="نوع الفائض">
            <Field label="ما نوع المنتجات الفائضة لديك؟" required error={errors.surplus_type}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                {SURPLUS_TYPES.map((s) => (
                  <CheckOption
                    key={s}
                    label={s}
                    checked={form.surplus_type.includes(s)}
                    onChange={() => toggleMulti("surplus_type", s)}
                  />
                ))}
              </div>
            </Field>
          </FormSection>

          {/* ── Section 5: Additional Info ── */}
          <FormSection title="معلومات إضافية (اختياري)">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="الكمية التقديرية">
                <Input
                  value={form.estimated_quantity}
                  onChange={(e) => set("estimated_quantity", e.target.value)}
                  placeholder="مثال: 500 قطعة أو 200 متر قماش"
                />
              </Field>
              <Field label="حساب إنستقرام">
                <Input
                  value={form.instagram_url}
                  onChange={(e) => set("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/yourstore"
                  dir="ltr"
                  className="text-right"
                />
              </Field>
              <Field label="الموقع الإلكتروني" className="sm:col-span-2">
                <Input
                  value={form.website_url}
                  onChange={(e) => set("website_url", e.target.value)}
                  placeholder="https://yourstore.com"
                  dir="ltr"
                  className="text-right"
                />
              </Field>
              <Field label="ملاحظات إضافية" className="sm:col-span-2">
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="أي معلومات إضافية تود إضافتها..."
                  rows={3}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none transition-colors"
                />
              </Field>
            </div>
          </FormSection>

          {/* ── Terms ── */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.accept_terms}
                onChange={(e) => set("accept_terms", e.target.checked)}
                className="w-5 h-5 rounded mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                أوافق على{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  شروط وأحكام منصة فائض
                </button>
                {" "}وأتحمل مسؤولية صحة المعلومات المُدخلة.
              </span>
            </label>
            {errors.accept_terms && (
              <p className="text-destructive text-xs mt-1.5 mr-8">{errors.accept_terms}</p>
            )}
          </div>

          <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />

          {/* ── Submit ── */}
          {submitError && (
            <p className="text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg shadow-lg shadow-primary/20"
            disabled={submitting}
          >
            {submitting ? "جاري الإرسال..." : "إرسال طلب الانضمام"}
          </Button>
        </form>
      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <BrandLogo className="h-8 w-auto cursor-pointer" />
        </Link>
        <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>
      </div>
    </header>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-bold border-b border-border/50 pb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-bold mb-1.5">
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </label>
      {children}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${
        checked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border hover:border-primary/40 text-foreground"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          checked ? "bg-primary border-primary" : "border-muted-foreground"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2 text-primary-foreground fill-current">
            <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}
