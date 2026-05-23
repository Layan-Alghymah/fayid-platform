import { useEffect, useState } from "react";
import { adminSupabase } from "@/lib/supabase";
import type { DiscountCode } from "@/lib/discountCodes";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Tag, CheckCircle2, XCircle, Trash2, Percent, DollarSign,
} from "lucide-react";

const defaultForm = {
  code: "",
  type: "percentage" as "percentage" | "fixed",
  value: "",
  expires_at: "",
  is_active: true,
};

export default function AdminDiscountCodes() {
  const { toast } = useToast();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadCodes() {
    setLoading(true);
    const { data, error } = await adminSupabase
      .from("discount_codes")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.error("[admin] loadCodes error:", error.message);
    setCodes((data ?? []) as DiscountCode[]);
    setLoading(false);
  }

  useEffect(() => { loadCodes(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.code.trim()) { setFormError("الكود مطلوب"); return; }
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) {
      setFormError("القيمة مطلوبة ويجب أن تكون رقماً موجباً");
      return;
    }
    if (form.type === "percentage" && Number(form.value) > 100) {
      setFormError("نسبة الخصم لا تتجاوز 100%");
      return;
    }

    setSaving(true);
    const { error } = await adminSupabase.from("discount_codes").insert({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: Number(form.value),
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    });

    if (error) {
      setFormError(error.message.includes("duplicate") || error.message.includes("unique")
        ? "هذا الكود موجود مسبقاً"
        : `خطأ: ${error.message}`);
    } else {
      toast({ title: "تم الإضافة", description: "تم إضافة كود الخصم بنجاح" });
      setShowForm(false);
      setForm(defaultForm);
      await loadCodes();
    }
    setSaving(false);
  };

  const handleToggle = async (id: number, current: boolean) => {
    await adminSupabase.from("discount_codes").update({ is_active: !current }).eq("id", id);
    await loadCodes();
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    await adminSupabase.from("discount_codes").delete().eq("id", id);
    setDeleteConfirm(null);
    setDeleting(false);
    toast({ title: "تم الحذف" });
    await loadCodes();
  };

  return (
    <AdminPasswordGate>
      <div dir="rtl" className="min-h-screen bg-background">
        <AdminNav />
        <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">أكواد الخصم</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {loading ? "..." : `${codes.length} كود`}
              </p>
            </div>
            <Button
              onClick={() => { setShowForm((v) => !v); setFormError(""); }}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              إضافة كود
            </Button>
          </div>

          {/* Add Form */}
          {showForm && (
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-5">كود خصم جديد</h2>
              <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Code */}
                <div>
                  <label className="block text-sm font-bold mb-1.5">الكود <span className="text-destructive">*</span></label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="FAYID20"
                    dir="ltr"
                    className="tracking-widest"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-bold mb-1.5">نوع الخصم</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as "percentage" | "fixed" }))}
                    className="w-full bg-background/50 border border-border rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>

                {/* Value */}
                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    القيمة {form.type === "percentage" ? "(%)" : "(ر.س)"} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={form.type === "percentage" ? 100 : undefined}
                    step={form.type === "percentage" ? 1 : 0.01}
                    value={form.value}
                    onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                    placeholder={form.type === "percentage" ? "20" : "50"}
                    dir="ltr"
                    className="text-right"
                  />
                </div>

                {/* Expires at */}
                <div>
                  <label className="block text-sm font-bold mb-1.5">
                    تاريخ الانتهاء <span className="text-muted-foreground font-normal">(اختياري)</span>
                  </label>
                  <Input
                    type="date"
                    value={form.expires_at}
                    onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                    dir="ltr"
                  />
                </div>

                {/* is_active */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-sm font-bold">كود نشط</span>
                  </label>
                </div>

                {formError && (
                  <p className="sm:col-span-2 text-destructive text-sm">{formError}</p>
                )}

                <div className="sm:col-span-2 flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "جاري الحفظ..." : "إضافة الكود"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setFormError(""); }}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Codes list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-card animate-pulse" />
              ))}
            </div>
          ) : codes.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-2xl">
              <Tag className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-xl font-bold">لا توجد أكواد خصم بعد</p>
              <p className="text-muted-foreground text-sm mt-1">أضف أول كود باستخدام الزر أعلاه</p>
            </div>
          ) : (
            <div className="space-y-3">
              {codes.map((c) => {
                const expired = c.expires_at ? new Date(c.expires_at) < new Date() : false;
                const effectiveActive = c.is_active && !expired;
                return (
                  <div
                    key={c.id}
                    className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    {/* Code & type icon */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {c.type === "percentage"
                        ? <Percent className="w-5 h-5 text-primary" />
                        : <DollarSign className="w-5 h-5 text-primary" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-lg tracking-widest" dir="ltr">{c.code}</span>
                        {effectiveActive ? (
                          <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> نشط
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" /> {expired ? "منتهي" : "معطل"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        خصم{" "}
                        {c.type === "percentage"
                          ? `${c.value}%`
                          : `${c.value} ر.س`}
                        {c.expires_at && (
                          <span className={`mr-2 ${expired ? "text-destructive" : ""}`}>
                            · ينتهي: {new Date(c.expires_at).toLocaleDateString("ar-SA")}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => handleToggle(c.id, c.is_active)}
                      >
                        {c.is_active ? (
                          <><XCircle className="w-3.5 h-3.5" /> تعطيل</>
                        ) : (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> تفعيل</>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
                        onClick={() => setDeleteConfirm(c.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Delete Confirmation Modal */}
        {deleteConfirm !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="glass-panel rounded-2xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-bold text-destructive">حذف الكود</h3>
              <p className="text-sm text-muted-foreground">
                هل أنت متأكد من حذف هذا الكود؟ لا يمكن التراجع.
              </p>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="destructive" className="flex-1"
                  disabled={deleting}
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  {deleting ? "جاري الحذف..." : "نعم، احذف"}
                </Button>
                <Button
                  variant="ghost" className="flex-1"
                  disabled={deleting}
                  onClick={() => setDeleteConfirm(null)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPasswordGate>
  );
}
