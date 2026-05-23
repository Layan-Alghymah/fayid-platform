import { useEffect, useState } from "react";
import { Link } from "wouter";
import { adminSupabase, type Supplier, type SupabaseProduct } from "@/lib/supabase";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import {
  Users, Package, CheckCircle2, AlertTriangle, ArrowLeft,
  TrendingUp, Store, ShoppingBag, BarChart2,
} from "lucide-react";

interface Stats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
}

const TYPE_LABELS: Record<string, string> = {
  manufacturer: "مصنع",
  wholesaler: "تاجر جملة",
  boutique: "بوتيك",
  other: "أخرى",
};

const CATEGORY_LABELS: Record<string, string> = {
  clothing: "ملابس",
  textiles: "أقمشة",
  abayas: "عبايات",
  dresses: "فساتين",
  clearance: "تصفية",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalProducts: 0,
    activeProducts: 0,
    lowStock: 0,
  });
  const [recentSuppliers, setRecentSuppliers] = useState<Supplier[]>([]);
  const [recentProducts, setRecentProducts] = useState<SupabaseProduct[]>([]);
  const [analyticsAvailable, setAnalyticsAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      const [
        totalSuppRes,
        activeSuppRes,
        totalProdRes,
        activeProdRes,
        lowStockRes,
        recentSuppRes,
        recentProdRes,
        analyticsRes,
      ] = await Promise.all([
        adminSupabase.from("suppliers").select("id", { count: "exact", head: true }),
        adminSupabase.from("suppliers").select("id", { count: "exact", head: true }).eq("is_active", true),
        adminSupabase.from("products").select("id", { count: "exact", head: true }),
        adminSupabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
        adminSupabase.from("products").select("id", { count: "exact", head: true }).lt("quantity", 10).eq("is_active", true),
        adminSupabase.from("suppliers").select("*").order("id", { ascending: false }).limit(5),
        adminSupabase.from("products").select("*").eq("is_active", true).order("id", { ascending: false }).limit(5),
        adminSupabase.from("page_views").select("id", { count: "exact", head: true }).limit(1),
      ]);

      setStats({
        totalSuppliers: totalSuppRes.count ?? 0,
        activeSuppliers: activeSuppRes.count ?? 0,
        totalProducts: totalProdRes.count ?? 0,
        activeProducts: activeProdRes.count ?? 0,
        lowStock: lowStockRes.count ?? 0,
      });

      setRecentSuppliers((recentSuppRes.data ?? []) as Supplier[]);
      setRecentProducts((recentProdRes.data ?? []) as SupabaseProduct[]);
      setAnalyticsAvailable(!analyticsRes.error);
      setLoading(false);
    }

    loadAll();
  }, []);

  return (
    <AdminPasswordGate>
      <div dir="rtl" className="min-h-screen bg-background">
        <AdminNav />
        <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">لوحة الإدارة</h1>
              <p className="text-muted-foreground text-sm mt-1">نظرة عامة على منصة فائض</p>
            </div>
            <Link href="/admin/suppliers">
              <Button className="gap-2">
                <Users className="w-4 h-4" />
                إدارة الموردين
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              icon={<Store className="w-5 h-5 text-blue-400" />}
              label="إجمالي الموردين"
              value={loading ? "..." : stats.totalSuppliers}
              color="blue"
            />
            <StatCard
              icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              label="موردون نشطون"
              value={loading ? "..." : stats.activeSuppliers}
              color="emerald"
            />
            <StatCard
              icon={<ShoppingBag className="w-5 h-5 text-purple-400" />}
              label="إجمالي المنتجات"
              value={loading ? "..." : stats.totalProducts}
              color="purple"
            />
            <StatCard
              icon={<Package className="w-5 h-5 text-primary" />}
              label="منتجات نشطة"
              value={loading ? "..." : stats.activeProducts}
              color="gold"
            />
            <StatCard
              icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
              label="منخفضة المخزون"
              value={loading ? "..." : stats.lowStock}
              color="amber"
            />
          </div>

          {/* ── Recent Suppliers + Recent Products ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Suppliers */}
            <section className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  آخر الموردين
                </h2>
                <Link href="/admin/suppliers">
                  <span className="text-xs text-primary hover:underline cursor-pointer">عرض الكل</span>
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-card animate-pulse" />)}
                </div>
              ) : recentSuppliers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">لا يوجد موردون بعد</p>
              ) : (
                <div className="space-y-2">
                  {recentSuppliers.map((s) => (
                    <Link key={s.id} href={`/admin/suppliers/${s.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-black text-sm">
                          {s.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{s.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {TYPE_LABELS[s.type ?? ""] ?? s.type ?? "—"}
                            {s.city ? ` · ${s.city}` : ""}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>
                          {s.is_active ? "نشط" : "غير نشط"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Products */}
            <section className="glass-panel rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  آخر المنتجات
                </h2>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-card animate-pulse" />)}
                </div>
              ) : recentProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">لا توجد منتجات بعد</p>
              ) : (
                <div className="space-y-2">
                  {recentProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-background/50 flex-shrink-0">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {CATEGORY_LABELS[p.category] ?? p.category}
                          {" · "}
                          {p.price} ر.س
                          {" · "}
                          <span className={p.quantity < 10 ? "text-amber-400" : ""}>
                            مخزون: {p.quantity}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Analytics ── */}
          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-primary" />
              التحليلات
            </h2>

            {analyticsAvailable === null || loading ? (
              <div className="h-20 rounded-xl bg-card animate-pulse" />
            ) : analyticsAvailable ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>جدول page_views موجود — يمكن عرض البيانات هنا</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-white/5">
                <BarChart2 className="w-8 h-8 text-muted-foreground opacity-40" />
                <div>
                  <p className="font-bold text-sm">التحليلات قريباً</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    سيتم عرض إحصائيات الزيارات والتفاعلات هنا بعد تفعيل جدول page_views.
                  </p>
                </div>
              </div>
            )}
          </section>

        </main>
      </div>
    </AdminPasswordGate>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  const styles: Record<string, string> = {
    blue:    "bg-blue-500/10 border-blue-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    purple:  "bg-purple-500/10 border-purple-500/20",
    gold:    "bg-primary/10 border-primary/20",
    amber:   "bg-amber-500/10 border-amber-500/20",
  };
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${styles[color] ?? styles.blue}`}>
      {icon}
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p>
      </div>
    </div>
  );
}
