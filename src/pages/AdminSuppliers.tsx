import { useEffect, useState } from "react";
import { Link } from "wouter";
import { adminSupabase, type Supplier } from "@/lib/supabase";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Plus,
  Store,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface SupplierWithCount extends Supplier {
  productCount: number;
}

const SUPPLIER_TYPES = [
  { value: "manufacturer", label: "مصنع" },
  { value: "wholesaler", label: "تاجر جملة" },
  { value: "boutique", label: "بوتيك" },
  { value: "other", label: "أخرى" },
];

const TYPE_LABELS: Record<string, string> = {
  manufacturer: "مصنع",
  wholesaler: "تاجر جملة",
  boutique: "بوتيك",
  other: "أخرى",
};

const defaultForm = {
  name: "",
  email: "",
  whatsapp: "",
  city: "",
  type: "wholesaler",
  is_active: true,
};

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<SupplierWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [newSupplierId, setNewSupplierId] = useState<number | null>(null);

  async function loadSuppliers() {
    setLoading(true);
    // Use adminSupabase to bypass RLS and avoid filtering by is_active.
    // Order by id (always exists) instead of created_at which may be missing.
    const { data: suppData, error: suppError } = await adminSupabase
      .from("suppliers")
      .select("*")
      .order("id", { ascending: false });

    if (suppError) {
      console.error("[admin] loadSuppliers error:", suppError.message);
    }

    const { data: prodData } = await adminSupabase
      .from("products")
      .select("supplier_id");

    const countMap: Record<number, number> = {};
    for (const p of prodData ?? []) {
      if (p.supplier_id) countMap[p.supplier_id] = (countMap[p.supplier_id] ?? 0) + 1;
    }

    setSuppliers(
      (suppData ?? []).map((s) => ({ ...s, productCount: countMap[s.id] ?? 0 }))
    );
    setLoading(false);
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.name.trim()) {
      setFormError("اسم المورد مطلوب");
      return;
    }

    setSaving(true);
    const { data: inserted, error } = await adminSupabase
      .from("suppliers")
      .insert({
        name: form.name.trim(),
        email: form.email.trim() || null,
        whatsapp: form.whatsapp.trim() || null,
        city: form.city.trim() || null,
        type: form.type || null,
        is_active: form.is_active,
      })
      .select()
      .single();

    if (error) {
      setFormError(`فشل الحفظ: ${error.message}`);
      setSaving(false);
      return;
    }

    setNewSupplierId(inserted?.id ?? null);
    setFormSuccess("تم إضافة المورد بنجاح");
    setForm(defaultForm);
    setSaving(false);
    await loadSuppliers();
  };

  return (
    <AdminPasswordGate>
      <div dir="rtl" className="min-h-screen bg-background">
        <AdminNav />
        <main className="max-w-6xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold">الموردون</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {loading ? "..." : `${suppliers.length} مورد`}
              </p>
            </div>
            <Button
              onClick={() => {
                setShowForm((v) => !v);
                setFormError("");
                setFormSuccess("");
                setNewSupplierId(null);
              }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة مورد
            </Button>
          </div>

          {/* Add Supplier Form */}
          {showForm && (
            <div className="glass-panel rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">إضافة مورد جديد</h2>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <FormField label="اسم المورد" required>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="النور للتجارة"
                  />
                </FormField>

                <FormField label="البريد الإلكتروني">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="supplier@example.com"
                    dir="ltr"
                    className="text-right"
                  />
                </FormField>

                <FormField label="واتساب">
                  <Input
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    placeholder="966501234567"
                    dir="ltr"
                    className="text-right"
                    inputMode="tel"
                  />
                </FormField>

                <FormField label="المدينة">
                  <Input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="الرياض"
                  />
                </FormField>

                <FormField label="النوع">
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-primary"
                  >
                    {SUPPLIER_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="الحالة">
                  <label className="flex items-center gap-3 h-11 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, is_active: e.target.checked }))
                      }
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm">مورد نشط</span>
                  </label>
                </FormField>

                {formError && (
                  <p className="col-span-full text-destructive text-sm">{formError}</p>
                )}

                {formSuccess && (
                  <div className="col-span-full flex flex-wrap items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                    <p className="text-green-500 text-sm font-medium flex-1">{formSuccess}</p>
                    {newSupplierId && (
                      <Link href={`/admin/suppliers/${newSupplierId}`}>
                        <Button size="sm" className="gap-1">
                          فتح صفحة المورد
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                <div className="col-span-full flex gap-3 pt-2">
                  {!formSuccess && (
                    <Button type="submit" disabled={saving}>
                      {saving ? "جاري الحفظ..." : "حفظ المورد"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setFormSuccess("");
                      setFormError("");
                      setNewSupplierId(null);
                    }}
                  >
                    {formSuccess ? "إغلاق" : "إلغاء"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Suppliers List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-card animate-pulse" />
              ))}
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-2xl">
              <Store className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-xl font-bold">لا يوجد موردون بعد</p>
              <p className="text-muted-foreground text-sm mt-1">
                أضف أول مورد باستخدام الزر أعلاه
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {suppliers.map((s) => (
                <div
                  key={s.id}
                  className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-primary" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{s.name}</h3>
                      {s.is_active ? (
                        <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> نشط
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" /> غير نشط
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      {s.type && (
                        <span className="text-xs text-muted-foreground">
                          {TYPE_LABELS[s.type] ?? s.type}
                        </span>
                      )}
                      {s.city && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {s.city}
                        </span>
                      )}
                      {s.whatsapp && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {s.whatsapp}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {s.productCount} منتج
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link href={`/admin/suppliers/${s.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 flex-shrink-0">
                      فتح صفحة المورد
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AdminPasswordGate>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5">
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </label>
      {children}
    </div>
  );
}
