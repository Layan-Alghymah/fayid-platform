import { useListAdminOrders } from "@workspace/api-client-react";
import { useState } from "react";
import { formatPrice, translateOrderStatus } from "@/lib/utils";
import { ShoppingBag, ChevronDown, ChevronUp, Search } from "lucide-react";

const STATUS_COLOR: Record<string, string> = {
  pending:   "bg-blue-500/15 text-blue-400 border-blue-500/20",
  confirmed: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  shipped:   "bg-purple-500/15 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/15 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
};

const STATUS_FILTERS = ["الكل", "تم استلام الطلب", "قيد التجهيز", "تم الشحن", "تم التسليم", "ملغي"];
const STATUS_MAP: Record<string, string> = {
  "تم استلام الطلب": "pending",
  "قيد التجهيز":    "confirmed",
  "تم الشحن":       "shipped",
  "تم التسليم":     "delivered",
  "ملغي":           "cancelled",
};

export function AdminOrdersTab() {
  const { data: orders, isLoading } = useListAdminOrders();
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("الكل");
  const [expanded, setExpanded]     = useState<number | null>(null);

  const list = (orders ?? []).filter((o: any) => {
    const matchStatus =
      statusFilter === "الكل" || o.status === STATUS_MAP[statusFilter];
    const matchSearch =
      !search ||
      String(o.id).includes(search) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalRevenue = (orders ?? [])
    .filter((o: any) => o.status === "delivered")
    .reduce((sum: number, o: any) => sum + (o.totalPrice ?? 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">إدارة الطلبات</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders?.length ?? 0} طلب إجمالي
          </p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-xl border-white/5 text-right">
          <p className="text-xs text-muted-foreground">إيرادات مكتملة</p>
          <p className="font-black text-primary">{formatPrice(totalRevenue)}</p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب أو العميل..."
            className="w-full bg-background/50 border border-border rounded-xl pr-10 pl-4 h-10 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <ShoppingBag className="w-12 h-12 opacity-20" />
          <p className="font-bold">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((order: any) => (
            <div key={order.id} className="glass-panel rounded-2xl overflow-hidden border-white/5">
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-black text-xs flex-shrink-0">
                    #{order.id}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{order.customerName || "عميل"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("ar-SA", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${STATUS_COLOR[order.status] ?? "bg-white/10 text-foreground border-white/10"}`}>
                    {translateOrderStatus(order.status)}
                  </span>
                  <span className="font-black text-primary text-sm">
                    {formatPrice(order.totalPrice)}
                  </span>
                  {expanded === order.id
                    ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-white/10 px-4 pb-4 pt-3 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                    المنتجات
                  </p>
                  {(order.items ?? []).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="font-bold text-primary text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
