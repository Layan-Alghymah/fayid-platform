import { useEffect, useState } from "react";
import { Link } from "wouter";
import { supabase } from "@/lib/supabase";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Users, Package, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

interface Stats {
  totalSuppliers: number;
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalSuppliers: 0,
    totalProducts: 0,
    activeProducts: 0,
    lowStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [suppliersRes, totalRes, activeRes, lowRes] = await Promise.all([
        supabase.from("suppliers").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .lt("quantity", 10)
          .eq("is_active", true),
      ]);
      setStats({
        totalSuppliers: suppliersRes.count ?? 0,
        totalProducts: totalRes.count ?? 0,
        activeProducts: activeRes.count ?? 0,
        lowStock: lowRes.count ?? 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <AdminPasswordGate>
      <div dir="rtl" className="min-h-screen bg-background">
        <AdminNav />
        <main className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold">لوحة الإدارة</h1>
            <p className="text-muted-foreground text-sm mt-1">مرحباً، فائض Admin</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard
              icon={<Users className="w-6 h-6 text-blue-400" />}
              label="إجمالي الموردين"
              value={loading ? "..." : stats.totalSuppliers}
              color="blue"
            />
            <StatCard
              icon={<Package className="w-6 h-6 text-purple-400" />}
              label="إجمالي المنتجات"
              value={loading ? "..." : stats.totalProducts}
              color="purple"
            />
            <StatCard
              icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
              label="المنتجات النشطة"
              value={loading ? "..." : stats.activeProducts}
              color="green"
            />
            <StatCard
              icon={<AlertTriangle className="w-6 h-6 text-amber-400" />}
              label="منخفضة المخزون"
              value={loading ? "..." : stats.lowStock}
              color="amber"
            />
          </div>

          {/* Actions */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">الإجراءات السريعة</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/suppliers">
                <Button size="lg" className="gap-2">
                  <Users className="w-5 h-5" />
                  إدارة الموردين
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </AdminPasswordGate>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  const bg: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
    green: "bg-green-500/10 border-green-500/20",
    amber: "bg-amber-500/10 border-amber-500/20",
  };
  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${bg[color]}`}>
      {icon}
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}
