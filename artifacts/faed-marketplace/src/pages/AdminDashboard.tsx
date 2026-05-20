// ──────────────────────────────────────────────────────────────────────────────
// Admin Dashboard — intentionally has NO public Navbar or Layout.
// Only accessible via direct URL: /admin
// Protected by AdminAuthContext (role === "admin")
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useLogout, useGetAdminStats } from "@workspace/api-client-react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { SupplierApprovalsTab } from "@/components/admin/SupplierApprovalsTab";
import { ProductApprovalsTab } from "@/components/admin/ProductApprovalsTab";
import { AdminOrdersTab }       from "@/components/admin/AdminOrdersTab";
import { CustomersTab }          from "@/components/admin/CustomersTab";
import { CategoriesTab }         from "@/components/admin/CategoriesTab";
import { ReportsTab }            from "@/components/admin/ReportsTab";
import { formatPrice }           from "@/lib/utils";
import {
  ShieldAlert, Users, Package, ShoppingBag, Tag,
  BarChart2, LogOut, Menu, X, ChevronLeft,
  CheckCircle2, TrendingUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId =
  | "overview"
  | "supplier-approvals"
  | "product-approvals"
  | "orders"
  | "customers"
  | "categories"
  | "reports";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview",           label: "الرئيسية",        icon: ShieldAlert  },
  { id: "supplier-approvals", label: "اعتماد الموردين", icon: Users        },
  { id: "product-approvals",  label: "المنتجات",        icon: Package      },
  { id: "orders",             label: "الطلبات",          icon: ShoppingBag  },
  { id: "customers",          label: "العملاء",           icon: Users        },
  { id: "categories",         label: "التصنيفات",        icon: Tag          },
  { id: "reports",            label: "التقارير",          icon: BarChart2    },
];

const TAB_LABEL: Record<TabId, string> = {
  "overview":           "لوحة التحكم",
  "supplier-approvals": "اعتماد الموردين",
  "product-approvals":  "إدارة المنتجات",
  "orders":             "إدارة الطلبات",
  "customers":          "العملاء",
  "categories":         "التصنيفات",
  "reports":            "التقارير والإحصائيات",
};

// ─── Overview tab (inline — uses real stats) ──────────────────────────────────

function OverviewTab({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const { data: stats } = useGetAdminStats();

  const statCards = [
    { label: "إجمالي الإيرادات",   value: formatPrice(stats?.totalRevenue  ?? 0), icon: TrendingUp,  accent: "from-amber-500/20 to-amber-500/5",  text: "text-amber-400"  },
    { label: "المستخدمون",          value: stats?.totalUsers     ?? 0,             icon: Users,       accent: "from-blue-500/20  to-blue-500/5",   text: "text-blue-400"   },
    { label: "المنتجات النشطة",     value: stats?.totalProducts  ?? 0,             icon: Package,     accent: "from-green-500/20 to-green-500/5",  text: "text-green-400"  },
    { label: "إجمالي الطلبات",      value: stats?.totalOrders    ?? 0,             icon: ShoppingBag, accent: "from-primary/20   to-primary/5",    text: "text-primary"    },
    { label: "موردون قيد الاعتماد", value: stats?.pendingSuppliers ?? 0,           icon: CheckCircle2, accent: "from-red-500/20   to-red-500/5",    text: "text-red-400"    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black">لوحة التحكم</h2>
        <p className="text-muted-foreground text-sm mt-0.5">نظرة عامة على أداء منصة فائض</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${s.accent} p-5 backdrop-blur-sm`}
            >
              <Icon className={`w-5 h-5 mb-3 ${s.text}`} />
              <div className={`text-2xl font-black ${s.text}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { tab: "supplier-approvals" as TabId, label: "مراجعة الموردين",    icon: Users,       color: "text-amber-400",  border: "border-amber-500/20", bg: "bg-amber-500/10", desc: `${stats?.pendingSuppliers ?? 0} طلب ينتظر` },
          { tab: "product-approvals"  as TabId, label: "إدارة المنتجات",    icon: Package,     color: "text-green-400",  border: "border-green-500/20", bg: "bg-green-500/10", desc: `${stats?.totalProducts ?? 0} منتج على المنصة` },
          { tab: "orders"             as TabId, label: "متابعة الطلبات",    icon: ShoppingBag, color: "text-blue-400",   border: "border-blue-500/20",  bg: "bg-blue-500/10",  desc: `${stats?.totalOrders ?? 0} طلب إجمالي` },
          { tab: "customers"          as TabId, label: "بيانات العملاء",     icon: Users,       color: "text-purple-400", border: "border-purple-500/20",bg: "bg-purple-500/10",desc: `${stats?.totalUsers ?? 0} مستخدم مسجل` },
          { tab: "categories"         as TabId, label: "إدارة التصنيفات",   icon: Tag,         color: "text-primary",    border: "border-primary/20",   bg: "bg-primary/10",   desc: "7 تصنيف نشط" },
          { tab: "reports"            as TabId, label: "عرض التقارير",       icon: BarChart2,   color: "text-amber-400",  border: "border-amber-500/20", bg: "bg-amber-500/10", desc: "إحصائيات المنصة" },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.tab}
              onClick={() => onNavigate(a.tab)}
              className={`flex items-start gap-4 p-4 rounded-2xl border text-right transition-all hover:scale-[1.02] ${a.border} ${a.bg}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5`}>
                <Icon className={`w-5 h-5 ${a.color}`} />
              </div>
              <div>
                <p className={`font-bold text-sm ${a.color}`}>{a.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { adminUser, isAdminAuthenticated, isLoading } = useAdminAuth();
  const [, setLocation] = useLocation();
  const queryClient    = useQueryClient();
  const [activeTab, setActiveTab]       = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const { data: stats }                 = useGetAdminStats();

  // Guard — redirect non-admins to admin login
  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      setLocation("/admin-login");
    }
  }, [isLoading, isAdminAuthenticated, setLocation]);

  const logoutMut = useLogout({
    mutation: {
      onSuccess: () => {
        localStorage.removeItem("auth_token");
        queryClient.clear();
        setLocation("/admin-login");
      },
    },
  });

  const navigate = (tab: TabId) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // ─── Loading ────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdminAuthenticated) return null;

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ════════════════════════════════════════════════ */}
      {/* Sidebar                                          */}
      {/* ════════════════════════════════════════════════ */}
      <aside className={`
        fixed md:sticky top-0 right-0 h-full md:h-screen
        w-72 md:w-60 flex-shrink-0 flex flex-col
        bg-[#060f14] border-l border-white/8
        z-50 md:z-auto transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
      `}>
        {/* Brand */}
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm">لوحة الإدارة</p>
              <p className="text-xs text-muted-foreground truncate">فائض</p>
            </div>
            <button className="md:hidden p-1" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Admin user chip */}
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
            <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-black text-primary">
                {adminUser?.name?.[0] ?? "A"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">{adminUser?.name}</p>
              <p className="text-[10px] text-primary">مشرف</p>
            </div>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="px-4 py-3 border-b border-white/8">
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: "موردون",  value: stats?.pendingSuppliers ?? 0, alert: (stats?.pendingSuppliers ?? 0) > 0 },
              { label: "منتجات", value: stats?.totalProducts    ?? 0, alert: false },
              { label: "طلبات",  value: stats?.totalOrders      ?? 0, alert: false },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-1.5 text-center">
                <p className={`font-black text-xs ${s.alert ? "text-amber-400" : "text-primary"}`}>
                  {s.value}
                </p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] text-muted-foreground/50 px-3 py-2 font-bold uppercase tracking-widest">
            القسم
          </p>
          {TABS.map((tab) => {
            const Icon    = tab.icon;
            const isActive = activeTab === tab.id;
            const showBadge = tab.id === "supplier-approvals" && (stats?.pendingSuppliers ?? 0) > 0;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-right ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "hover:bg-white/8 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-xs flex-1">{tab.label}</span>
                {showBadge && (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20" : "bg-amber-500/30 text-amber-400"
                  }`}>
                    {stats!.pendingSuppliers}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/8 space-y-1">
          <button
            onClick={() => setLocation("/")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>عرض المتجر</span>
          </button>
          <button
            onClick={() => logoutMut.mutate()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-red-500/5 transition-colors text-xs"
            disabled={logoutMut.isPending}
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════ */}
      {/* Main content                                     */}
      {/* ════════════════════════════════════════════════ */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 py-3 bg-background/80 backdrop-blur-md border-b border-white/8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <p className="font-bold text-sm">{TAB_LABEL[activeTab]}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground/60">
            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
            <span>منطقة الإدارة الداخلية</span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {activeTab === "overview"           && <OverviewTab onNavigate={navigate} />}
          {activeTab === "supplier-approvals" && <SupplierApprovalsTab />}
          {activeTab === "product-approvals"  && <ProductApprovalsTab />}
          {activeTab === "orders"             && <AdminOrdersTab />}
          {activeTab === "customers"          && <CustomersTab />}
          {activeTab === "categories"         && <CategoriesTab />}
          {activeTab === "reports"            && <ReportsTab />}
        </div>
      </main>
    </div>
  );
}
