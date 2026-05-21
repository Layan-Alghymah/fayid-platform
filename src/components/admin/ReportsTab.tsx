import { useGetAdminStats } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Users, Package, ShoppingBag, Clock, BarChart2 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ─── Mock monthly data (no monthly-breakdown endpoint available) ──────────────

const MOCK_MONTHLY = [
  { month: "يناير",   revenue: 12400, orders: 48 },
  { month: "فبراير",  revenue: 18700, orders: 71 },
  { month: "مارس",    revenue: 15200, orders: 59 },
  { month: "أبريل",   revenue: 22100, orders: 84 },
  { month: "مايو",    revenue: 19800, orders: 76 },
  { month: "يونيو",   revenue: 25600, orders: 98 },
];

const MOCK_CATEGORIES = [
  { name: "أقمشة",    value: 42 },
  { name: "فساتين",   value: 31 },
  { name: "عباءات",   value: 23 },
  { name: "حجابات",   value: 18 },
  { name: "قمصان",    value: 14 },
  { name: "إكسسوارات", value: 7 },
];

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub, accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 border-white/5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Tooltip styles ───────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  background: "#0F3D4F",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  direction: "rtl" as const,
};

// ─── Main component ───────────────────────────────────────────────────────────

export function ReportsTab() {
  const { data: stats } = useGetAdminStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black">التقارير والإحصائيات</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          نظرة عامة على أداء المنصة
        </p>
      </div>

      {/* KPI cards — real data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="إجمالي الإيرادات"
          value={formatPrice(stats?.totalRevenue ?? 0)}
          accent="bg-amber-500/15 text-amber-400"
        />
        <StatCard
          icon={<ShoppingBag className="w-5 h-5" />}
          label="إجمالي الطلبات"
          value={stats?.totalOrders ?? 0}
          accent="bg-blue-500/15 text-blue-400"
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="المنتجات النشطة"
          value={stats?.totalProducts ?? 0}
          accent="bg-green-500/15 text-green-400"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="المستخدمون"
          value={stats?.totalUsers ?? 0}
          accent="bg-primary/20 text-primary"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-panel rounded-2xl p-5 border-white/5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-purple-400">{stats?.pendingSuppliers ?? 0}</p>
            <p className="text-xs text-muted-foreground">موردون ينتظرون الاعتماد</p>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5 border-white/5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-black text-orange-400">
              {stats?.totalOrders && stats.totalOrders > 0
                ? formatPrice((stats.totalRevenue ?? 0) / stats.totalOrders)
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground">متوسط قيمة الطلب</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue trend */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-white/5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-primary" />
            الإيرادات الشهرية
            <span className="text-xs text-muted-foreground font-normal">(بيانات تجريبية)</span>
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_MONTHLY} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="adminRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#195155" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#195155" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: any) => [formatPrice(v), "الإيرادات"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#195155"
                fill="url(#adminRevenueGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown */}
        <div className="glass-panel rounded-2xl p-6 border-white/5">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            توزيع المنتجات
            <span className="text-xs text-muted-foreground font-normal">(تجريبي)</span>
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_CATEGORIES} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#888" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#888" }} width={60} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [v, "منتج"]} />
              <Bar dataKey="value" fill="#195155" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders trend */}
      <div className="glass-panel rounded-2xl p-6 border-white/5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-blue-400" />
          عدد الطلبات الشهرية
          <span className="text-xs text-muted-foreground font-normal">(بيانات تجريبية)</span>
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={MOCK_MONTHLY} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#888" }} />
            <YAxis tick={{ fontSize: 11, fill: "#888" }} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: any) => [v, "طلب"]} />
            <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-muted-foreground/50 text-center">
        * الأرقام الشهرية تجريبية — الأرقام الإجمالية حقيقية من قاعدة البيانات
      </p>
    </div>
  );
}
