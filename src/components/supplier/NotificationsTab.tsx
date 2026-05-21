import { useListSupplierOrders, useListSupplierProducts } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/utils";
import {
  Bell, ShoppingBag, AlertTriangle, CheckCircle2,
  XCircle, Building2, Package, Info,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifCategory = "all" | "orders" | "stock" | "system";

interface Notification {
  id: string;
  category: NotifCategory;
  type: "new_order" | "low_stock" | "out_of_stock" | "product_approved" | "product_rejected" | "account" | "info";
  title: string;
  message: string;
  timeLabel: string;
  read: boolean;
}

const CATEGORY_TABS: { id: NotifCategory; label: string }[] = [
  { id: "all",    label: "الكل" },
  { id: "orders", label: "الطلبات" },
  { id: "stock",  label: "المخزون" },
  { id: "system", label: "النظام" },
];

// ─── Icon map ─────────────────────────────────────────────────────────────────

const NOTIF_ICON: Record<Notification["type"], React.ElementType> = {
  new_order:        ShoppingBag,
  low_stock:        AlertTriangle,
  out_of_stock:     Package,
  product_approved: CheckCircle2,
  product_rejected: XCircle,
  account:          Building2,
  info:             Info,
};

const NOTIF_COLOR: Record<Notification["type"], string> = {
  new_order:        "bg-blue-500/15 text-blue-400 border-blue-500/20",
  low_stock:        "bg-orange-500/15 text-orange-400 border-orange-500/20",
  out_of_stock:     "bg-red-500/15 text-red-400 border-red-500/20",
  product_approved: "bg-green-500/15 text-green-400 border-green-500/20",
  product_rejected: "bg-red-500/15 text-red-400 border-red-500/20",
  account:          "bg-amber-500/15 text-amber-400 border-amber-500/20",
  info:             "bg-white/5 text-muted-foreground border-white/10",
};

// ─── Notification card ────────────────────────────────────────────────────────

function NotifCard({
  notif,
  onRead,
}: {
  notif: Notification;
  onRead: (id: string) => void;
}) {
  const Icon = NOTIF_ICON[notif.type];
  const colorCls = NOTIF_COLOR[notif.type];

  return (
    <div
      className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/5 ${
        notif.read ? "border-white/5 opacity-70" : "border-white/10 bg-white/[0.02]"
      }`}
      onClick={() => onRead(notif.id)}
    >
      {/* unread dot */}
      {!notif.read && (
        <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-primary" />
      )}

      {/* icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${colorCls}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* body */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-tight ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
          {notif.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.message}</p>
        <p className="text-xs text-muted-foreground/60 mt-1.5">{notif.timeLabel}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function NotificationsTab() {
  const { user } = useAuth();
  const { data: orders } = useListSupplierOrders();
  const { data: products } = useListSupplierProducts();

  const [category, setCategory] = useState<NotifCategory>("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const isApproved = user?.supplierStatus === "approved";

  // ─── Build notifications from real + mock data ──────────────────────────

  const notifications = useMemo<Notification[]>(() => {
    const list: Notification[] = [];

    // 1. Real: new (pending) orders
    const pendingOrders = (orders ?? []).filter((o) => o.status === "pending");
    pendingOrders.slice(0, 5).forEach((order) => {
      list.push({
        id: `order-${order.id}`,
        category: "orders",
        type: "new_order",
        title: `طلب جديد #${order.id}`,
        message: `وصل طلب جديد بقيمة ${formatPrice(order.totalPrice)} من ${order.customerName || "عميل"}. يرجى المراجعة والتجهيز.`,
        timeLabel: new Intl.DateTimeFormat("ar-SA", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(order.createdAt)),
        read: false,
      });
    });

    // 2. Real: out-of-stock products
    const outOfStock = (products ?? []).filter((p) => p.quantity === 0 && p.isActive);
    outOfStock.slice(0, 3).forEach((p) => {
      list.push({
        id: `oos-${p.id}`,
        category: "stock",
        type: "out_of_stock",
        title: "نفد المخزون",
        message: `المنتج "${p.name}" نفد مخزونه تماماً. أضف كميات جديدة لاستمرار المبيعات.`,
        timeLabel: "منذ قليل",
        read: false,
      });
    });

    // 3. Real: low-stock products (qty 1-9)
    const lowStock = (products ?? []).filter((p) => p.quantity > 0 && p.quantity < 10 && p.isActive);
    lowStock.slice(0, 3).forEach((p) => {
      list.push({
        id: `low-${p.id}`,
        category: "stock",
        type: "low_stock",
        title: "تحذير: مخزون منخفض",
        message: `تبقّى ${p.quantity} قطعة فقط من "${p.name}". يُنصح بتجديد المخزون قريباً.`,
        timeLabel: "اليوم",
        read: false,
      });
    });

    // 4. Mock system notifications
    const mockSystem: Notification[] = [
      {
        id: "sys-approved-1",
        category: "system",
        type: "product_approved",
        title: "تمت الموافقة على منتجك",
        message: "تمت مراجعة منتج \"عباءة حرير فاخرة\" والموافقة عليه. أصبح ظاهراً للمشترين الآن.",
        timeLabel: "أمس",
        read: true,
      },
      {
        id: "sys-rejected-1",
        category: "system",
        type: "product_rejected",
        title: "تم رفض منتج",
        message: "تعذّر قبول منتج \"قماش غير موصوف\" بسبب نقص المعلومات. يرجى تحديث الوصف والصور وإعادة التقديم.",
        timeLabel: "منذ يومين",
        read: true,
      },
      isApproved
        ? {
            id: "sys-account",
            category: "system",
            type: "account",
            title: "تهانينا! تم اعتماد متجرك",
            message: "تمّ مراجعة بيانات متجرك والموافقة عليه. يمكنك الآن نشر منتجاتك وبدء البيع.",
            timeLabel: "منذ أسبوع",
            read: true,
          }
        : {
            id: "sys-pending",
            category: "system",
            type: "account",
            title: "متجرك قيد المراجعة",
            message: "تمّ استلام طلب تسجيل متجرك وهو قيد المراجعة من فريق فائض. ستصلك إشعار فور الاعتماد.",
            timeLabel: "عند التسجيل",
            read: false,
          },
      {
        id: "sys-info-1",
        category: "system",
        type: "info",
        title: "نصيحة: حسّن قوائم منتجاتك",
        message: "المنتجات التي تحتوي صوراً واضحة ووصفاً مفصلاً تحقق مبيعات أعلى بنسبة 40%. تأكد من تحديث بيانات منتجاتك.",
        timeLabel: "منذ 3 أيام",
        read: true,
      },
    ];
    list.push(...mockSystem);

    // Sort: unread first, then by id insertion order
    return list.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1));
  }, [orders, products, isApproved]);

  // ─── Apply read state overlay ───────────────────────────────────────────

  const displayed = notifications.map((n) => ({
    ...n,
    read: n.read || readIds.has(n.id),
  }));

  const filtered =
    category === "all" ? displayed : displayed.filter((n) => n.category === category);

  const unreadCount = displayed.filter((n) => !n.read).length;

  const markAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const markOneRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            الإشعارات
            {unreadCount > 0 && (
              <span className="text-sm font-black bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0
              ? `لديك ${unreadCount} إشعار غير مقروء`
              : "جميع الإشعارات مقروءة"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-primary hover:underline font-bold flex-shrink-0 mt-1"
          >
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORY_TABS.map((tab) => {
          const count =
            tab.id === "all"
              ? displayed.filter((n) => !n.read).length
              : displayed.filter((n) => n.category === tab.id && !n.read).length;
          return (
            <button
              key={tab.id}
              onClick={() => setCategory(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                category === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    category === tab.id ? "bg-white/20" : "bg-primary/30 text-primary"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Bell className="w-12 h-12 opacity-20" />
          <p className="font-bold">لا توجد إشعارات</p>
          <p className="text-sm">ستظهر إشعاراتك هنا</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((notif) => (
            <NotifCard key={notif.id} notif={notif} onRead={markOneRead} />
          ))}
        </div>
      )}
    </div>
  );
}
