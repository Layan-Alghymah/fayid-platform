import { useListSupplierOrders } from "@workspace/api-client-react";
import { useState } from "react";
import { formatPrice, translateOrderStatus } from "@/lib/utils";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function OrdersTab() {
  const { data: orders } = useListSupplierOrders();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("الكل");

  const statusOptions = ["الكل", "تم استلام الطلب", "قيد التجهيز", "تم الشحن", "تم التسليم", "ملغي"];
  const statusMap: Record<string, string> = {
    "تم استلام الطلب": "pending",
    "قيد التجهيز": "confirmed",
    "تم الشحن": "shipped",
    "تم التسليم": "delivered",
    "ملغي": "cancelled",
  };

  const filtered = (orders ?? []).filter(o =>
    statusFilter === "الكل" || o.status === statusMap[statusFilter]
  );

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div>
        <h2 className="text-2xl font-black">الطلبات الواردة</h2>
        <p className="text-sm text-muted-foreground">{orders?.length ?? 0} طلب إجمالي</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusOptions.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <ShoppingBag className="w-12 h-12 opacity-30" />
          <p>لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order: any) => (
            <div key={order.id} className="glass-panel rounded-2xl overflow-hidden border-white/5">
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black text-sm">
                    #{order.id}
                  </div>
                  <div>
                    <p className="font-bold">{order.customerName || "عميل"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${STATUS_COLORS[order.status] ?? "bg-white/10 text-foreground"}`}>
                    {translateOrderStatus(order.status)}
                  </span>
                  <span className="font-black text-primary">{formatPrice(order.totalPrice)}</span>
                  {expanded === order.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-white/10 px-5 pb-5 pt-4 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">تفاصيل الطلب</p>
                  {(order.items ?? []).map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-xl object-cover" />}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="font-bold text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">الإجمالي</span>
                    <span className="font-black text-lg text-primary">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
