import { useEffect, useState } from "react";
import { Link } from "wouter";
import { adminSupabase, type Supplier, type SupabaseProduct } from "@/lib/supabase";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import {
  Users, Package, CheckCircle2, AlertTriangle, ArrowLeft,
  TrendingUp, Store, ShoppingBag, BarChart2, Tag, ChevronLeft,
  Eye, MessageSquare, Calendar,
} from "lucide-react";

interface Stats {
  totalSuppliers: number;
  activeSuppliers: number;
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
}

interface AnalyticsData {
  pageViewsTotal: number;
  pageViewsToday: number;
  checkoutEventsTotal: number;
  topPages: { path: string; count: number }[];
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
  const [pageViewsAvailable, setPageViewsAvailable] = useState<boolean | null>(null);
  const [checkoutEventsAvailable, setCheckoutEventsAvailable] = useState<boolean | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViewsTotal: 0,
    pageViewsToday: 0,
    checkoutEventsTotal: 0,
    topPages: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [
        totalSuppRes,
        activeSuppRes,
        totalProdRes,
        activeProdRes,
        lowStockRes,
        recentSuppRes,
        recentProdRes,
        pageViewsTotalRes,
        pageViewsTodayRes,
        checkoutTotalRes,
      ] = await Promise.all([
        adminSupabase.from("suppliers").select("id", { count: "exact", head: true }),
        adminSupabase.from("suppliers").select("id", { count: "exact", head: true }).eq("is_active", true),
        adminSupabase.from("products").select("id", { count: "exact", head: true }),
        adminSupabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
        adminSupabase.from("products").select("id", { count: "exact", head: true }).lt("quantity", 10).eq("is_active", true),
        adminSupabase.from("suppliers").select("*").order("id", { ascending: false }).limit(5),
        adminSupabase.from("products").select("*").eq("is_active", true).order("id", { ascending: false }).limit(5),
        adminSupabase.from("page_views").select("id", { count: "exact", head: true }),
        adminSupabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
        adminSupabase.from("checkout_events").select("id", { count: "exact", head: true }),
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

      const pvAvail = !pageViewsTotalRes.error;
      const ceAvail = !checkoutTotalRes.error;
      setPageViewsAvailable(pvAvail);
      setCheckoutEventsAvailable(ceAvail);

      setAnalytics({
        pageViewsTotal: pvAvail ? (pageViewsTotalRes.count ?? 0) : 0,
        pageViewsToday: pvAvail ? (pageViewsTodayRes.count ?? 0) : 0,
        checkoutEventsTotal: ceAvail ? (checkoutTotalRes.count ?? 0) : 0,
        topPages: [],
      });

      // Load top pages if page_views exists
      if (pvAvail) {
        const { data: topPagesData } = await adminSupabase
          .from("page_views")
          .select("path")
          .order("created_at", { ascending: false })
          .limit(500);

        if (topPagesData) {
          const pathCount: Record<string, number> = {};
          for (const row of topPagesData) {
            if (row.path) pathCount[row.path] = (pathCount[row.path] ?? 0) + 1;
          }
          const sorted = Object.entries(pathCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([path, count]) => ({ path, count }));
          setAnalytics((prev) => ({ ...prev, topPages: sorted }));
        }
      }

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

          {/* ── Analytics Stats ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<Eye className="w-5 h-5 text-sky-400" />}
              label="إجمالي زيارات الموقع"
              value={loading || pageViewsAvailable === null
                ? "..."
                : pageViewsAvailable ? analytics.pageViewsTotal : "—"}
              color="sky"
              note={pageViewsAvailable === false ? "يتطلب جدول page_views" : undefined}
            />
            <StatCard
              icon={<Calendar className="w-5 h-5 text-indigo-400" />}
              label="زيارات اليوم"
              value={loading || pageViewsAvailable === null
                ? "..."
                : pageViewsAvailable ? analytics.pageViewsToday : "—"}
              color="indigo"
              note={pageViewsAvailable === false ? "يتطلب جدول page_views" : undefined}
            />
            <StatCard
              icon={<MessageSquare className="w-5 h-5 text-green-400" />}
              label="طلبات واتساب"
              value={loading || checkoutEventsAvailable === null
                ? "..."
                : checkoutEventsAvailable ? analytics.checkoutEventsTotal : "—"}
              color="green"
              note={checkoutEventsAvailable === false ? "يتطلب جدول checkout_events" : undefined}
            />
          </div>

          {/* ── Quick Links ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/admin/suppliers">
              <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
                <Store className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">الموردون</p>
                  <p className="text-xs text-muted-foreground">إدارة الموردين</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
            <Link href="/admin/suppliers">
              <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
                <ShoppingBag className="w-6 h-6 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">المنتجات</p>
                  <p className="text-xs text-muted-foreground">إدارة عبر الموردين</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
            <Link href="/admin/discount-codes">
              <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer group">
                <Tag className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm">أكواد الخصم</p>
                  <p className="text-xs text-muted-foreground">إدارة الأكواد</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
            <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 opacity-50 cursor-not-allowed">
              <Package className="w-6 h-6 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">الطلبات</p>
                <p className="text-xs text-muted-foreground">قريباً</p>
              </div>
            </div>
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
                            مخزون: {p.quantity}{(p as any).unit === "meter" ? " متر" : ""}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Analytics Detail ── */}
          <section className="glass-panel rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              التحليلات
            </h2>

            {loading ? (
              <div className="h-24 rounded-xl bg-card animate-pulse" />
            ) : (
              <div className="space-y-6">
                {/* Page views detail */}
                {pageViewsAvailable ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-muted-foreground">أكثر الصفحات زيارة</p>
                    {analytics.topPages.length === 0 ? (
                      <p className="text-sm text-muted-foreground">لا توجد بيانات بعد</p>
                    ) : (
                      <div className="space-y-2">
                        {analytics.topPages.map(({ path, count }) => (
                          <div key={path} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground font-mono flex-1 truncate" dir="ltr">
                              {path || "/"}
                            </span>
                            <div className="flex items-center gap-2">
                              <div
                                className="h-1.5 bg-primary/40 rounded-full"
                                style={{ width: `${Math.max(20, Math.round((count / (analytics.topPages[0]?.count || 1)) * 120))}px` }}
                              />
                              <span className="text-xs font-bold text-primary w-8 text-left">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-white/5">
                    <TrendingUp className="w-8 h-8 text-muted-foreground opacity-40" />
                    <div>
                      <p className="font-bold text-sm">تتبع الزيارات غير مفعّل</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        أنشئ جدول <code className="bg-white/10 px-1 rounded">page_views</code> في Supabase لتفعيل تتبع الزيارات.
                      </p>
                    </div>
                  </div>
                )}

                {/* Checkout events */}
                {!checkoutEventsAvailable && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-white/5">
                    <MessageSquare className="w-8 h-8 text-muted-foreground opacity-40" />
                    <div>
                      <p className="font-bold text-sm">تتبع طلبات واتساب غير مفعّل</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        أنشئ جدول <code className="bg-white/10 px-1 rounded">checkout_events</code> في Supabase لتتبع الطلبات.
                      </p>
                    </div>
                  </div>
                )}
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
  icon, label, value, color, note,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  note?: string;
}) {
  const styles: Record<string, string> = {
    blue:    "bg-blue-500/10 border-blue-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20",
    purple:  "bg-purple-500/10 border-purple-500/20",
    gold:    "bg-primary/10 border-primary/20",
    amber:   "bg-amber-500/10 border-amber-500/20",
    sky:     "bg-sky-500/10 border-sky-500/20",
    indigo:  "bg-indigo-500/10 border-indigo-500/20",
    green:   "bg-green-500/10 border-green-500/20",
  };
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${styles[color] ?? styles.blue}`}>
      {icon}
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</p>
        {note && <p className="text-[10px] text-muted-foreground/60 mt-1 leading-tight">{note}</p>}
      </div>
    </div>
  );
}
