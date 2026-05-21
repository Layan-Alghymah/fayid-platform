import { useQuery } from "@tanstack/react-query";
import { useGetSupplierStats } from "@/lib/api-client";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, Package, ShoppingBag } from "lucide-react";

const ARABIC_MONTHS: Record<string, string> = {
  "01": "يناير", "02": "فبراير", "03": "مارس", "04": "أبريل",
  "05": "مايو", "06": "يونيو", "07": "يوليو", "08": "أغسطس",
  "09": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر",
};

export function SalesTab() {
  const { data: stats } = useGetSupplierStats();
  const { data: analytics } = useQuery({
    queryKey: ["/api/supplier/analytics"],
    queryFn: () => apiFetch("/api/supplier/analytics"),
  });

  const monthly = (analytics?.monthly ?? []).map((m: any) => ({
    name: ARABIC_MONTHS[m.month?.split("-")[1]] ?? m.month,
    "الإيرادات (ريال)": Math.round(m.revenue),
    "الطلبات": m.orders,
  }));

  const topProducts = (analytics?.topProducts ?? []).map((p: any) => ({
    name: p.name.length > 15 ? p.name.slice(0, 15) + "..." : p.name,
    "الإيرادات": Math.round(p.revenue),
    "الوحدات": p.units,
  }));

  const hasData = monthly.length > 0;

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      <div>
        <h2 className="text-2xl font-black">المبيعات والتحليلات</h2>
        <p className="text-sm text-muted-foreground">نظرة شاملة على أداء متجرك</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "إجمالي الإيرادات", value: formatPrice(stats?.totalRevenue ?? 0), icon: <TrendingUp className="w-5 h-5" />, color: "text-[#c9a84c]" },
          { title: "إجمالي الطلبات", value: stats?.totalOrders ?? 0, icon: <ShoppingBag className="w-5 h-5" />, color: "text-primary" },
          { title: "المنتجات النشطة", value: stats?.totalProducts ?? 0, icon: <Package className="w-5 h-5" />, color: "text-green-400" },
        ].map((s, i) => (
          <div key={i} className="glass-panel rounded-2xl p-5 border-white/5">
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.title}</div>
          </div>
        ))}
      </div>

      {!hasData ? (
        <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
          <TrendingUp className="w-16 h-16 opacity-20" />
          <p className="text-lg font-bold">لا توجد بيانات مبيعات بعد</p>
          <p className="text-sm">ستظهر التحليلات هنا عند بدء استلام الطلبات</p>
        </div>
      ) : (
        <>
          <div className="glass-panel rounded-2xl p-6 border-white/5">
            <h3 className="font-bold mb-6">الإيرادات الشهرية</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthly} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#195155" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#195155" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#888" }} />
                <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                <Tooltip
                  contentStyle={{ background: "#0F3D4F", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, direction: "rtl" }}
                  formatter={(v: any, n) => [n === "الإيرادات (ريال)" ? formatPrice(v) : v, n]}
                />
                <Legend wrapperStyle={{ fontSize: 12, direction: "rtl" }} />
                <Area type="monotone" dataKey="الإيرادات (ريال)" stroke="#195155" fill="url(#revGrad)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="الطلبات" stroke="#c9a84c" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {topProducts.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border-white/5">
              <h3 className="font-bold mb-6">أكثر المنتجات مبيعاً</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 10, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#888" }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#ccc" }} width={75} />
                  <Tooltip
                    contentStyle={{ background: "#0F3D4F", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, direction: "rtl" }}
                    formatter={(v: any, n) => [n === "الإيرادات" ? formatPrice(v) : v, n]}
                  />
                  <Bar dataKey="الإيرادات" fill="#195155" radius={[0, 6, 6, 0]} />
                  <Bar dataKey="الوحدات" fill="#c9a84c" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
