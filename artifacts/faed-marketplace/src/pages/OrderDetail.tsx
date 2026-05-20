import { Layout } from "@/components/Layout";
import { useGetOrder } from "@workspace/api-client-react";
import type { Order } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useParams, useLocation } from "wouter";
import {
  formatPrice,
  translateOrderStatus,
  translatePaymentMethod,
  mockTrackingNumber,
  formatDate,
} from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Hash,
  Home,
  Search,
  Bike,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

// ─── Status helpers ───────────────────────────────────────────────────────────

type BackendStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const STATUS_COLOR: Record<string, string> = {
  pending:   "bg-blue-500/15 text-blue-400 border-blue-500/20",
  confirmed: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  shipped:   "bg-purple-500/15 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/15 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/20",
};

const STATUS_ICON: Record<string, React.ElementType> = {
  pending:   Clock,
  confirmed: Package,
  shipped:   Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

// ─── Tracking steps ───────────────────────────────────────────────────────────

const TRACKING_STEPS = [
  { label: "تم استلام الطلب",  Icon: CheckCircle2 },
  { label: "قيد المراجعة",     Icon: Search },
  { label: "قيد التجهيز",      Icon: Package },
  { label: "تم الشحن",         Icon: Truck },
  { label: "مع المندوب",       Icon: Bike },
  { label: "تم التسليم",       Icon: Home },
];

/**
 * Returns the index of the LAST completed step (0-based).
 * -1 means nothing started yet (impossible for a real order).
 */
function activeStepIndex(status: string): number {
  switch (status) {
    case "pending":   return 1;  // received + reviewing done
    case "confirmed": return 2;  // + preparing
    case "shipped":   return 4;  // + shipped + with courier
    case "delivered": return 5;  // all done
    default:          return 0;
  }
}

function TrackingStep({
  step,
  idx,
  activeIdx,
  isCancelled,
  date,
}: {
  step: (typeof TRACKING_STEPS)[number];
  idx: number;
  activeIdx: number;
  isCancelled: boolean;
  date: string;
}) {
  const done    = !isCancelled && idx <= activeIdx;
  const current = !isCancelled && idx === activeIdx;
  const Icon = step.Icon;

  return (
    <div className="flex gap-4">
      {/* left rail: circle + connector */}
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all ${
            isCancelled
              ? "border-red-500/30 bg-red-500/10"
              : done
              ? current
                ? "border-primary bg-primary shadow-[0_0_12px_rgba(25,81,85,0.6)]"
                : "border-primary/60 bg-primary/20"
              : "border-white/10 bg-background"
          }`}
        >
          {isCancelled ? (
            <XCircle className="w-4 h-4 text-red-400" />
          ) : done ? (
            current ? (
              <Icon className="w-4 h-4 text-primary-foreground" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-primary" />
            )
          ) : (
            <Icon className="w-4 h-4 text-muted-foreground/40" />
          )}
        </div>
        {idx < TRACKING_STEPS.length - 1 && (
          <div
            className={`w-0.5 flex-1 min-h-[28px] mt-1 transition-colors ${
              done && idx < activeIdx ? "bg-primary/40" : "bg-white/5"
            }`}
          />
        )}
      </div>

      {/* right: label + date */}
      <div className={`pb-6 ${idx === TRACKING_STEPS.length - 1 ? "pb-0" : ""}`}>
        <p
          className={`font-bold text-sm leading-tight ${
            isCancelled
              ? "text-muted-foreground"
              : current
              ? "text-foreground"
              : done
              ? "text-foreground/70"
              : "text-muted-foreground/40"
          }`}
        >
          {step.label}
        </p>
        {(done || isCancelled) && (
          <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
        )}
      </div>
    </div>
  );
}

// ─── Address parser ───────────────────────────────────────────────────────────

function parseAddress(raw?: string | null) {
  if (!raw) return { display: "—", region: null };
  // Try to extract region (first segment before first ،)
  const parts = raw.split("،");
  const region = parts[0]?.trim() ?? null;
  return { display: raw, region };
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
      title="نسخ"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ─── Main detail section ──────────────────────────────────────────────────────

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <div className="font-semibold text-sm text-foreground break-words">{value}</div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetail() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const orderId = Number(params.id);

  const { data: order, isLoading, isError } = useGetOrder(orderId, {
    query: { enabled: isAuthenticated && !isNaN(orderId) },
  });

  // ─── guards ──────────────────────────────────────────────────────────────

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

  if (isNaN(orderId) || isError || !order) {
    return (
      <Layout>
        <div dir="rtl" className="max-w-2xl mx-auto px-4 py-20 text-center">
          <XCircle className="w-14 h-14 text-destructive mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-bold mb-2">الطلب غير موجود</h2>
          <p className="text-muted-foreground mb-6">لا يمكن العثور على هذا الطلب.</p>
          <Link href="/orders"><Button>العودة لطلباتي</Button></Link>
        </div>
      </Layout>
    );
  }

  // ─── derived values ───────────────────────────────────────────────────────

  const status = order.status as BackendStatus;
  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered";
  const showTracking = !isCancelled;
  const activeIdx = activeStepIndex(status);
  const items = order.items ?? [];
  const { display: addressDisplay } = parseAddress(order.shippingAddress);
  const trackingNum = (status === "shipped" || status === "delivered")
    ? mockTrackingNumber(order.id)
    : null;

  const StatusIcon = STATUS_ICON[status] ?? Clock;

  return (
    <Layout>
      <div dir="rtl" className="max-w-3xl mx-auto px-4 py-10">

        {/* Back */}
        <Link href="/orders">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronRight className="w-4 h-4" />
            العودة لطلباتي
          </button>
        </Link>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold">
              طلب <span className="text-primary">#{order.id}</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${
              STATUS_COLOR[status] ?? "bg-white/10 text-muted-foreground"
            }`}
          >
            <StatusIcon className="w-4 h-4" />
            {translateOrderStatus(status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ─── Left column: tracking + order info ─────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Tracking stepper */}
            <div className="glass-panel rounded-2xl p-5 border-white/5">
              <h2 className="font-bold text-base mb-5 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" />
                تتبع الطلب
              </h2>

              {isCancelled ? (
                <div className="flex flex-col items-center py-4 text-center gap-2">
                  <XCircle className="w-10 h-10 text-red-400" />
                  <p className="font-bold text-red-400">تم إلغاء الطلب</p>
                  <p className="text-xs text-muted-foreground">
                    إذا دفعت مسبقاً سيتم استرداد المبلغ خلال 3-5 أيام عمل
                  </p>
                </div>
              ) : (
                <div>
                  {TRACKING_STEPS.map((step, idx) => (
                    <TrackingStep
                      key={idx}
                      step={step}
                      idx={idx}
                      activeIdx={activeIdx}
                      isCancelled={false}
                      date={
                        idx <= activeIdx
                          ? idx === 0
                            ? formatDate(order.createdAt)
                            : formatDate(order.createdAt) // mock same date for MVP
                          : ""
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Order details */}
            <div className="glass-panel rounded-2xl p-5 border-white/5">
              <h2 className="font-bold text-base mb-3">تفاصيل الطلب</h2>

              <DetailRow
                icon={<Hash className="w-4 h-4 text-primary" />}
                label="رقم الطلب"
                value={
                  <span className="font-mono">#{order.id}</span>
                }
              />

              {trackingNum && (
                <DetailRow
                  icon={<Truck className="w-4 h-4 text-purple-400" />}
                  label="رقم التتبع"
                  value={
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-primary">{trackingNum}</span>
                      <CopyButton text={trackingNum} />
                    </div>
                  }
                />
              )}

              <DetailRow
                icon={<CreditCard className="w-4 h-4 text-amber-400" />}
                label="طريقة الدفع"
                value={translatePaymentMethod(order.paymentMethod)}
              />

              <DetailRow
                icon={<MapPin className="w-4 h-4 text-green-400" />}
                label="عنوان التوصيل"
                value={addressDisplay}
              />
            </div>
          </div>

          {/* ─── Right column: products + price ────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Products */}
            <div className="glass-panel rounded-2xl p-5 border-white/5">
              <h2 className="font-bold text-base mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                المنتجات
                <span className="text-muted-foreground font-normal text-sm">({items.length})</span>
              </h2>

              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">لا توجد منتجات</p>
              ) : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-background/50 flex-shrink-0 border border-white/5">
                        <img
                          src={
                            item.imageUrl ||
                            "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=80&h=80&fit=crop"
                          }
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.productName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          الكمية: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-primary text-sm whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price summary */}
            <div className="glass-panel rounded-2xl p-5 border-white/5 space-y-3 text-sm">
              <h2 className="font-bold text-base mb-1">ملخص السعر</h2>

              <div className="flex justify-between text-muted-foreground">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>رسوم الشحن</span>
                <span className="text-green-400">مشمولة</span>
              </div>
              <div className="flex justify-between font-black text-base border-t border-white/10 pt-3">
                <span>الإجمالي</span>
                <span className="text-primary">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>

            {/* Action: re-order or continue shopping */}
            <div className="flex gap-3">
              <Link href="/products" className="flex-1">
                <Button variant="ghost" className="w-full">
                  متابعة التسوق
                </Button>
              </Link>
              {isDelivered && (
                <Link href="/products" className="flex-1">
                  <Button className="w-full">إعادة الطلب</Button>
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
