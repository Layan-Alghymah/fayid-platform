import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, Copy, Check } from "lucide-react";

interface DiscountCode {
  id: number;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  usesCount: number;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
}

export function DiscountsTab() {
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: codes = [] } = useQuery<DiscountCode[]>({
    queryKey: ["/api/supplier/discounts"],
    queryFn: () => apiFetch("/api/supplier/discounts"),
  });

  const createMut = useMutation({
    mutationFn: (data: any) => apiFetch("/api/supplier/discounts", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/discounts"] });
      setShowForm(false);
      reset();
      toast({ title: "تم الإنشاء", description: "تم إنشاء كود الخصم بنجاح" });
    },
    onError: (e: any) => toast({ title: "خطأ", description: e.message, variant: "destructive" }),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      apiFetch(`/api/supplier/discounts/${id}`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/supplier/discounts"] }),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => apiFetch(`/api/supplier/discounts/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supplier/discounts"] });
      toast({ title: "تم الحذف" });
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { code: "", discountType: "percentage", discountValue: 10, minOrderAmount: "", maxUses: "", expiresAt: "" },
  });

  const onSubmit = (data: any) => {
    const payload: any = {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
    };
    if (data.minOrderAmount) payload.minOrderAmount = Number(data.minOrderAmount);
    if (data.maxUses) payload.maxUses = Number(data.maxUses);
    if (data.expiresAt) payload.expiresAt = new Date(data.expiresAt).toISOString();
    createMut.mutate(payload);
  };

  const copyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">أكواد الخصم</h2>
          <p className="text-sm text-muted-foreground">{codes.length} كود خصم</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> كود جديد
        </Button>
      </div>

      {showForm && (
        <div className="glass-panel rounded-2xl p-6 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="font-bold mb-5 flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> إنشاء كود خصم جديد</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">كود الخصم</label>
                <Input
                  {...register("code", { required: "مطلوب", minLength: { value: 3, message: "3 أحرف على الأقل" } })}
                  placeholder="مثال: FAED20"
                  className="uppercase"
                  dir="ltr"
                />
                {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message as string}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">نوع الخصم</label>
                <select {...register("discountType")} className="w-full bg-background/50 border border-border rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-primary">
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ريال)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">قيمة الخصم</label>
                <Input type="number" {...register("discountValue", { required: "مطلوب", min: 1 })} placeholder="10" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">الحد الأدنى للطلب (ريال)</label>
                <Input type="number" {...register("minOrderAmount")} placeholder="اختياري" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">الحد الأقصى للاستخدام</label>
                <Input type="number" {...register("maxUses")} placeholder="غير محدود" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-muted-foreground">تاريخ الانتهاء (اختياري)</label>
                <Input type="date" {...register("expiresAt")} dir="ltr" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={createMut.isPending}>إنشاء الكود</Button>
              <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>إلغاء</Button>
            </div>
          </form>
        </div>
      )}

      {codes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Tag className="w-12 h-12 opacity-30" />
          <p className="font-bold">لا توجد أكواد خصم</p>
          <p className="text-sm">أنشئ كودك الأول لزيادة المبيعات</p>
          <Button size="sm" onClick={() => setShowForm(true)}>إنشاء كود خصم</Button>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/5">
          <table className="w-full text-sm text-right">
            <thead className="bg-black/20 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-bold">الكود</th>
                <th className="px-5 py-3 font-bold hidden sm:table-cell">الخصم</th>
                <th className="px-5 py-3 font-bold hidden md:table-cell">الاستخدام</th>
                <th className="px-5 py-3 font-bold hidden lg:table-cell">الانتهاء</th>
                <th className="px-5 py-3 font-bold">الحالة</th>
                <th className="px-5 py-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(code => {
                const isExpired = code.expiresAt ? new Date(code.expiresAt) < new Date() : false;
                return (
                  <tr key={code.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-black text-primary bg-primary/10 px-2 py-1 rounded-lg text-sm">
                          {code.code}
                        </code>
                        <button
                          onClick={() => copyCode(code.code, code.id)}
                          className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedId === code.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="font-bold text-[#c9a84c]">
                        {code.discountType === "percentage" ? `${code.discountValue}%` : `${code.discountValue} ريال`}
                      </span>
                      {code.minOrderAmount && (
                        <p className="text-xs text-muted-foreground">حد أدنى: {code.minOrderAmount} ر.س</p>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span>{code.usesCount} / {code.maxUses ?? "∞"}</span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                      {code.expiresAt
                        ? <span className={isExpired ? "text-red-400" : ""}>{new Date(code.expiresAt).toLocaleDateString("ar-SA")}</span>
                        : "بدون انتهاء"}
                    </td>
                    <td className="px-5 py-3">
                      {isExpired ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">منتهي</span>
                      ) : (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${code.isActive ? "bg-green-500/20 text-green-400" : "bg-white/10 text-muted-foreground"}`}>
                          {code.isActive ? "نشط" : "موقوف"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleMut.mutate({ id: code.id, isActive: !code.isActive })}
                          className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                          title={code.isActive ? "إيقاف" : "تفعيل"}
                        >
                          {code.isActive ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => { if (confirm("حذف هذا الكود؟")) deleteMut.mutate(code.id); }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
