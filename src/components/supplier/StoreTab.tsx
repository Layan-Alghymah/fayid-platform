import { useAuth } from "@/contexts/AuthContext";
import { useGetSupplierStats, useListSupplierProducts } from "@/lib/api-client";
import { formatPrice } from "@/lib/utils";
import {
  Store, CheckCircle2, Clock, Phone, Mail, User,
  Package, ShoppingBag, TrendingUp, Star, AlertTriangle,
} from "lucide-react";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="glass-panel rounded-2xl p-5 border-white/5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-black">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-white/5 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-sm mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function StoreTab() {
  const { user } = useAuth();
  const { data: stats } = useGetSupplierStats();
  const { data: products } = useListSupplierProducts();

  const isApproved = user?.supplierStatus === "approved";

  const activeProducts = (products ?? []).filter((p) => p.isActive && p.quantity > 0).length;
  const lowStockCount = (products ?? []).filter((p) => p.quantity > 0 && p.quantity < 10).length;
  const outOfStockCount = (products ?? []).filter((p) => p.quantity === 0 && p.isActive).length;

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black">معلومات المتجر</h2>
        <p className="text-sm text-muted-foreground mt-0.5">ملف متجرك العام وإحصائياتك</p>
      </div>

      {/* Store identity card */}
      <div className="glass-panel rounded-2xl p-6 border-white/5">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <Store className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black">{user?.name}</h3>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                  isApproved
                    ? "bg-green-500/15 text-green-400 border-green-500/20"
                    : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                }`}
              >
                {isApproved ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                {isApproved ? "مورد معتمد" : "قيد المراجعة"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">مورد في منصة فائض</p>
          </div>
        </div>

        {!isApproved && (
          <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-300">
              حسابك لا يزال قيد المراجعة من فريق فائض. ستصلك رسالة إشعار فور الاعتماد.
            </p>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-3">إحصائيات المتجر</p>
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
            value={activeProducts}
            accent="bg-green-500/15 text-green-400"
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="طلبات منتظرة"
            value={stats?.pendingOrders ?? 0}
            accent="bg-primary/20 text-primary"
          />
        </div>
      </div>

      {/* Stock alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-red-400">منتجات نفد مخزونها</p>
                <p className="text-xs text-muted-foreground mt-0.5">{outOfStockCount} منتج بحاجة لإعادة تعبئة</p>
              </div>
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-orange-400">مخزون منخفض</p>
                <p className="text-xs text-muted-foreground mt-0.5">{lowStockCount} منتج بكمية أقل من 10 قطع</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact info */}
      <div className="glass-panel rounded-2xl p-5 border-white/5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">بيانات الحساب</p>
          <span className="text-xs text-muted-foreground/50 bg-white/5 px-2 py-1 rounded-lg">قراءة فقط</span>
        </div>
        <InfoRow icon={<User className="w-4 h-4" />} label="اسم المورد / المتجر" value={user?.name ?? "—"} />
        <InfoRow icon={<Mail className="w-4 h-4" />} label="البريد الإلكتروني" value={user?.email ?? "—"} />
        <InfoRow icon={<Phone className="w-4 h-4" />} label="رقم الجوال" value="غير محدد" />
      </div>

      {/* Edit coming soon */}
      <div className="text-center py-6 text-muted-foreground">
        <p className="text-sm">تعديل بيانات المتجر قادم قريباً</p>
        <p className="text-xs mt-1 opacity-60">للتعديل الآن تواصل مع فريق الدعم</p>
      </div>
    </div>
  );
}
