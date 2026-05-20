import { Layout } from "@/components/Layout";
import { useListOrders } from "@workspace/api-client-react";
import type { Order } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import {
  formatPrice,
  translateOrderStatus,
  translatePaymentMethod,
  formatDate,
} from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ShoppingBag,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
} from "lucide-react";
import { useState } from "react";

// ─── status helpers ───────────────────────────────────────────────────────────

type FilterTab = "all" | "active" | "delivered" | "cancelled";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all",       label: "الكل" },
  { id: "active",    label: "قيد التنفيذ" },
  { id: "delivered", label: "مكتمل" },
  { id: "cancelled", label: "ملغي" },
];

function matchesFilter(order: Order, tab: FilterTab) {
  if (tab === "all") return true;
  if (tab === "active")    return ["pending", "confirmed", "shipped"].includes(order.status);
  if (tab === "delivered") return order.status === "delivered";
  if (tab === "cancelled") return order.status === "cancelled";
  return true;
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; Icon: React.ElementType }> = {
    pending:   { cls: "bg-blue-500/15 text-blue-400 border-blue-500/20",    Icon: Clock },
    confirmed: { cls: "bg-amber-500/15 text-amber-400 border-amber-500/20", Icon: Package },
    shipped:   { cls: "bg-purple-500/15 text-purple-400 border-purple-500/20", Icon: Truck },
    delivered: { cls: "bg-green-500/15 text-green-400 border-green-500/20", Icon: CheckCircle2 },
    cancelled: { cls: "bg-red-500/15 text-red-400 border-red-500/20",       Icon: XCircle },
  };
  const { cls, Icon } = cfg[status] ?? { cls: "bg-white/10 text-muted-foreground", Icon: Clock };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}>
      <Icon className="w-3 h-3" />
      {translateOrderStatus(status)}
    </span>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const items = order.items ?? [];
  const visibleItems = items.slice(0, 3);
  const extra = items.length - 3;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-black text-base">
            طلب <span className="text-primary">#{order.id}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Product thumbnails */}
      {items.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {visibleItems.map((item, idx) => (
            <div
              key={idx}
              className="relative w-14 h-14 rounded-xl overflow-hidden bg-background/50 flex-shrink-0 border border-white/5"
            >
              <img
                src={
                  item.imageUrl ||
                  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&h=80&fit=crop"
                }
                alt={item.productName}
                className="w-full h-full object-cover"
              />
              {item.quantity > 1 && (
                <span className="absolute bottom-0 right-0 bg-black/70 text-[10px] font-bold text-white px-1 rounded-tl">
                  ×{item.quantity}
                </span>
              )}
            </div>
          ))}
          {extra > 0 && (
            <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs text-muted-foreground font-bold flex-shrink-0">
              +{extra}
            </div>
          )}
          <div className="flex-1 min-w-0 mr-1">
            <p className="text-sm font-semibold truncate">
              {visibleItems[0]?.productName}
              {items.length > 1 ? ` وآخرون (${items.length})` : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {translatePaymentMethod(order.paymentMethod)}
            </p>
          </div>
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div>
          <p className="text-xs text-muted-foreground">الإجمالي</p>
          <p className="font-black text-primary">{formatPrice(order.totalPrice)}</p>
        </div>
        <Link href={`/orders/${order.id}`}>
          <Button size="sm" variant="ghost" className="flex items-center gap-1.5 text-sm hover:bg-white/10">
            تفاصيل الطلب
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Orders() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<FilterTab>("all");

  const { data: orders, isLoading } = useListOrders({
    query: { enabled: isAuthenticated },
  });

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (user?.role === 'supplier') {
    setLocation("/supplier");
    return null;
  }

  const sorted = [...(orders ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const filtered = sorted.filter((o) => matchesFilter(o, tab));

  return (
    <Layout>
      <div dir="rtl" className="max-w-4xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">طلباتي</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {sorted.length > 0
              ? `لديك ${sorted.length} طلب`
              : "لا توجد طلبات حتى الآن"}
          </p>
        </div>

        {/* Filter tabs */}
        {sorted.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {FILTER_TABS.map((t) => {
              const count =
                t.id === "all"
                  ? sorted.length
                  : sorted.filter((o) => matchesFilter(o, t.id)).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    tab === t.id
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        tab === t.id ? "bg-white/20" : "bg-white/10"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 glass-panel rounded-3xl">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-5 opacity-30" />
            <h2 className="text-xl font-bold mb-2">
              {tab === "all" ? "لا توجد طلبات بعد" : "لا توجد طلبات في هذه الفئة"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {tab === "all"
                ? "ابدأ التسوق وستظهر طلباتك هنا"
                : "جرّب تصفية مختلفة"}
            </p>
            {tab === "all" && (
              <Link href="/products">
                <Button>تصفح المنتجات</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
