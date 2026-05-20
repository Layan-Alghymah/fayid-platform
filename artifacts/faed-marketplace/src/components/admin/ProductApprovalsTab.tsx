import { useListAdminProducts, useAdminDeleteProduct } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Package, Search, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";

const CONDITION_LABEL: Record<string, string> = {
  production_surplus: "فائض إنتاج",
  season_surplus:     "فائض موسم",
  minor_defect:       "عيب بسيط",
  clearance:          "تصفية مخزون",
  new_unused:         "جديد غير مستخدم",
  overstock:          "فائض مخزون",
  end_of_season:      "نهاية الموسم",
  minor_defect_old:   "عيب بسيط",
};

export function ProductApprovalsTab() {
  const { data: products, isLoading } = useListAdminProducts();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch]   = useState("");
  const [catFilter, setCat]   = useState("الكل");

  const deleteMut = useAdminDeleteProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
        toast({ title: "تم الحذف", description: "تم حذف المنتج بنجاح" });
      },
      onError: () => {
        toast({ title: "خطأ", description: "تعذّر حذف المنتج", variant: "destructive" });
      },
    },
  });

  const allCategories = ["الكل", ...Array.from(new Set((products ?? []).map((p: any) => p.category).filter(Boolean)))];

  const list = (products ?? []).filter((p: any) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.supplierName?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "الكل" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black">إدارة المنتجات</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {products?.length ?? 0} منتج إجمالي على المنصة
        </p>
      </div>

      {/* Search + category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو المورد..."
            className="w-full bg-background/50 border border-border rounded-xl pr-10 pl-4 h-10 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allCategories.slice(0, 6).map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                catFilter === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Package className="w-12 h-12 opacity-20" />
          <p className="font-bold">لا توجد منتجات</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/5">
          <table className="w-full text-sm text-right">
            <thead className="bg-black/20 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-bold">المنتج</th>
                <th className="px-5 py-3 font-bold hidden md:table-cell">المورد</th>
                <th className="px-5 py-3 font-bold hidden lg:table-cell">الحالة</th>
                <th className="px-5 py-3 font-bold">السعر</th>
                <th className="px-5 py-3 font-bold hidden sm:table-cell">المخزون</th>
                <th className="px-5 py-3 font-bold">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p: any) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          : <Package className="w-4 h-4 m-3 text-muted-foreground/40" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold leading-tight line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-muted-foreground text-xs">
                    {p.supplierName || "—"}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    {p.quantity === 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" /> نفد
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" /> نشط
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-bold text-primary whitespace-nowrap">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-muted-foreground">
                    {p.quantity} قطعة
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => {
                        if (confirm(`هل تريد حذف "${p.name}"؟`)) {
                          deleteMut.mutate({ id: p.id });
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
