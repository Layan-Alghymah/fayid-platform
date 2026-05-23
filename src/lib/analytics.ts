import { supabase } from "@/lib/supabase";

/**
 * Track a page view. Inserts into page_views table.
 * Fails silently — never breaks the app.
 */
export async function trackPageView(path: string): Promise<void> {
  try {
    await supabase.from("page_views").insert({
      path,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    });
  } catch {
    // Intentionally silent
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
