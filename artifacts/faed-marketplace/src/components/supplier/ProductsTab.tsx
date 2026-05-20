import { useListSupplierProducts, useDeleteProduct, useUpdateProduct } from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, Search, X, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";

const CATEGORIES = ["عباءات", "حجابات", "فساتين", "بدلات", "قمصان", "أقمشة"];

interface ProductsTabProps {
  onAddProduct: () => void;
}

export function ProductsTab({ onAddProduct }: ProductsTabProps) {
  const { data: products } = useListSupplierProducts();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("الكل");
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMut = useDeleteProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/supplier/products"] });
        queryClient.invalidateQueries({ queryKey: ["/api/supplier/stats"] });
        toast({ title: "تم الحذف", description: "تم حذف المنتج بنجاح" });
      },
    },
  });

  const updateMut = useUpdateProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/supplier/products"] });
        setEditingId(null);
        toast({ title: "تم التحديث", description: "تم تحديث المنتج بنجاح" });
      },
    },
  });

  const filtered = (products ?? []).filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "الكل" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  function StockBadge({ qty }: { qty: number }) {
    if (qty === 0) return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />نفد</span>;
    if (qty < 10) return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />{qty} قطعة</span>;
    return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" />{qty} قطعة</span>;
  }

  function ProductStatusBadge({ isActive, qty }: { isActive: boolean; qty: number }) {
    if (!isActive)
      return <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10 flex items-center gap-1 w-fit">موقوف</span>;
    if (qty === 0)
      return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />نفد المخزون</span>;
    if (qty < 10)
      return <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/20 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />مخزون منخفض</span>;
    return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" />نشط</span>;
  }

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-black">إدارة المنتجات</h2>
          <p className="text-sm text-muted-foreground">{products?.length ?? 0} منتج</p>
        </div>
        <Button onClick={onAddProduct} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة منتج
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="pr-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["الكل", ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                catFilter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Package className="w-12 h-12 opacity-30" />
          <p>لا توجد منتجات</p>
          <Button size="sm" onClick={onAddProduct}>إضافة أول منتج</Button>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/5">
          <table className="w-full text-sm text-right">
            <thead className="bg-black/20 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-bold">المنتج</th>
                <th className="px-5 py-3 font-bold hidden md:table-cell">القسم</th>
                <th className="px-5 py-3 font-bold">السعر</th>
                <th className="px-5 py-3 font-bold hidden sm:table-cell">المخزون</th>
                <th className="px-5 py-3 font-bold hidden md:table-cell">الحالة</th>
                <th className="px-5 py-3 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                editingId === p.id
                  ? <EditRow key={p.id} product={p} onSave={(data) => updateMut.mutate({ id: p.id, data })} onCancel={() => setEditingId(null)} isPending={updateMut.isPending} />
                  : (
                    <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />}
                          <div>
                            <p className="font-semibold leading-tight">{p.name}</p>
                            {p.originalPrice > p.price && (
                              <span className="text-xs text-[#c9a84c]">خصم {calculateDiscount(p.price, p.originalPrice)}%</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell text-muted-foreground">{p.category}</td>
                      <td className="px-5 py-3 font-bold text-primary">{formatPrice(p.price)}</td>
                      <td className="px-5 py-3 hidden sm:table-cell"><StockBadge qty={p.quantity} /></td>
                      <td className="px-5 py-3 hidden md:table-cell"><ProductStatusBadge isActive={p.isActive} qty={p.quantity} /></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingId(p.id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) deleteMut.mutate({ id: p.id }); }}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EditRow({ product, onSave, onCancel, isPending }: any) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: product.quantity,
      category: product.category,
      description: product.description ?? "",
    },
  });

  return (
    <tr className="bg-primary/10 border-b border-primary/20">
      <td colSpan={5} className="px-5 py-4">
        <form onSubmit={handleSubmit(onSave)} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-muted-foreground mb-1 block">الاسم</label>
            <Input {...register("name")} className="h-9 text-sm" />
          </div>
          <div className="w-28">
            <label className="text-xs text-muted-foreground mb-1 block">السعر</label>
            <Input type="number" {...register("price")} className="h-9 text-sm" />
          </div>
          <div className="w-28">
            <label className="text-xs text-muted-foreground mb-1 block">الأصلي</label>
            <Input type="number" {...register("originalPrice")} className="h-9 text-sm" />
          </div>
          <div className="w-24">
            <label className="text-xs text-muted-foreground mb-1 block">الكمية</label>
            <Input type="number" {...register("quantity")} className="h-9 text-sm" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" isLoading={isPending}>حفظ</Button>
            <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-white/10"><X className="w-4 h-4" /></button>
          </div>
        </form>
      </td>
    </tr>
  );
}
