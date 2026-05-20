import { useGetSupplierStats, useListSupplierOrders } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { formatPrice, translateOrderStatus } from "@/lib/utils";
import { TrendingUp, Package, ShoppingBag, Clock, BarChart2, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ARABIC_MONTHS: Record<string, string> = {
  "01": "يناير", "02": "فبراير", "03": "مارس", "04": "أبريل",
  "05": "مايو", "06": "يونيو", "07": "يوليو", "08": "أغسطس",
  "09": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر",
};

export function OverviewTab() {
  const { data: stats } = useGetSupplierStats();
  const { data: orders } = useListSupplierOrders();
  const { data: analytics } = useQuery({
    queryKey: ["/api/supplier/analytics"],
    queryFn: () => apiFetch("/api/supplier/analytics"),
  });

  const recentOrders = (orders ?? []).slice(0, 5);
  const chartData = (analytics?.monthly ?? []).map((m: any) => ({
    name: ARABIC_MONTHS[m.month?.split("-")[1]] ?? m.month,
    الإيرادات: Math.round(m.revenue),
    الطلبات: m.orders,
  }));

  const statCards = [
    {
      title: "إجمالي الإيرادات",
      value: formatPrice(stats?.totalRevenue ?? 0),
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-[#c9a84c]/20 to-[#c9a84c]/5",
      accent: "text-[#c9a84c]",
    },
    {
      title: "المنتجات النشطة",
      value: stats?.totalProducts ?? 0,
      icon: <Package className="w-5 h-5" />,
      color: "from-primary/20 to-primary/5",
      accent: "text-primary",
    },
    {
      title: "إجمالي الطلبات",
      value: stats?.totalOrders ?? 0,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "from-green-500/20 to-green-500/5",
      accent: "text-green-400",
    },
    {
      title: "طلبات قيد الانتظار",
      value: stats?.pendingOrders ?? 0,
      icon: <Clock className="w-5 h-5" />,
      color: "from-orange-500/20 to-orange-500/5",
      accent: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black mb-1">لوحة التحكم</h2>
        <p className="text-muted-foreground text-sm">مرحباً، هذا ملخص نشاطك التجاري</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${card.color} p-5 backdrop-blur-sm`}
          >
            <div className={`${card.accent} mb-3`}>{card.icon}</div>
            <div className="text-2xl font-black">{card.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><BarChart2 className="w-4 h-4 text-primary" /> الإيرادات الشهرية</h3>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#195155" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#195155" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} />
                <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                <Tooltip
                  contentStyle={{ background: "#0F3D4F", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, direction: "rtl" }}
                  formatter={(value: any) => [formatPrice(value), "الإيرادات"]}
                />
                <Area type="monotone" dataKey="الإيرادات" stroke="#195155" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              لا توجد بيانات مبيعات بعد
            </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl p-6 border-white/5">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-primary" /> آخر الطلبات
          </h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ? recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-semibold">طلب #{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{formatPrice(order.totalPrice)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{translateOrderStatus(order.status)}</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-8">لا توجد طلبات بعد</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
