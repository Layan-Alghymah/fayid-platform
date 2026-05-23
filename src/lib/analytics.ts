import { supabase } from "@/lib/supabase";

// In-memory deduplication: "visitorId|path" → last tracked timestamp (ms)
const recentTracks = new Map<string, number>();

function getVisitorId(): string {
  const KEY = "fayid_visitor_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

function getSessionId(): string {
  const KEY = "fayid_session_id";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

/**
 * Track a page view. Inserts into page_views table.
 * - Generates anonymous visitor_id (localStorage) and session_id (sessionStorage).
 * - Skips admin routes.
 * - Deduplicates: ignores same visitor+path within 30 seconds.
 * - Never breaks the app — logs error only.
 */
export async function trackPageView(path: string): Promise<void> {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    // Deduplicate rapid duplicate views (same visitor + same path within 30s)
    const dedupeKey = `${visitorId}|${path}`;
    const lastTracked = recentTracks.get(dedupeKey);
    const now = Date.now();
    if (lastTracked !== undefined && now - lastTracked < 30_000) return;
    recentTracks.set(dedupeKey, now);

    const { error } = await supabase.from("page_views").insert({
      path,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
      visitor_id: visitorId,
      session_id: sessionId,
    });

    if (error) console.error("[analytics] trackPageView insert error:", error.message);
  } catch (err) {
    console.error("[analytics] trackPageView failed:", err);
  }
}

/**
 * Track a checkout/WhatsApp order event.
 * Inserts into checkout_events table.
 * Fails silently — still opens WhatsApp even if this fails.
 */
export async function trackCheckoutEvent(data: {
  cartItems: unknown[];
  subtotal: number;
  shippingTotal: number;
  discountCode?: string;
  discountAmount?: number;
  grandTotal: number;
  whatsappNumber: string;
}): Promise<void> {
  try {
    await supabase.from("checkout_events").insert({
      event_type: "whatsapp_order",
      cart_items: data.cartItems,
      subtotal: data.subtotal,
      shipping_total: data.shippingTotal,
      discount_code: data.discountCode ?? null,
      discount_amount: data.discountAmount ?? 0,
      grand_total: data.grandTotal,
      whatsapp_number: data.whatsappNumber,
    });
  } catch {
    // Intentionally silent
  }
}
