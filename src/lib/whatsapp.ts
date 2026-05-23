import type { CartItem } from "@/hooks/useCart";

/** Fayid receives orders on this number (customer sends from their own WhatsApp).
 *  Reads from VITE_WHATSAPP_NUMBER env var; strips leading + and non-digit chars. */
const _rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER ?? "966555687510";
export const WHATSAPP_NUMBER = _rawNumber.replace(/[^\d]/g, "");

export type WhatsAppCheckoutCustomer = {
  name: string;
  phone: string;
  cityAddress: string;
  notes?: string;
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "الدفع عند الاستلام (كاش)",
  bank_transfer: "تحويل بنكي",
};

function formatSar(amount: number): string {
  return `${amount.toLocaleString("ar-SA")} ر.س`;
}

function getSupplierName(item: CartItem): string {
  const p = item.product as CartItem["product"] & { supplier_name?: string };
  return (
    p.supplierName?.trim() ||
    p.supplier_name?.trim() ||
    "مورد غير محدد"
  );
}

function groupCartBySupplier(items: CartItem[]): Map<string, CartItem[]> {
  const groups = new Map<string, CartItem[]>();
  for (const item of items) {
    const supplier = getSupplierName(item);
    const list = groups.get(supplier) ?? [];
    list.push(item);
    groups.set(supplier, list);
  }
  return groups;
}

/**
 * Builds the Arabic WhatsApp order message (grouped by supplier/store).
 * @param shippingMap - per-supplier shipping cost (supplierName → SAR)
 * @param paymentMethod - "cod" | "bank_transfer"
 * @param discount - optional applied discount { code, amount }
 */
export function buildWhatsAppOrderMessage(
  items: CartItem[],
  customer: WhatsAppCheckoutCustomer,
  shippingMap: Record<string, number> = {},
  paymentMethod = "bank_transfer",
  discount?: { code: string; amount: number }
): string {
  const lines: string[] = [];
  lines.push("طلب جديد من منصة فائض");
  lines.push("");
  lines.push("بيانات العميل:");
  lines.push(`الاسم: ${customer.name}`);
  lines.push(`الجوال: ${customer.phone}`);
  lines.push(`المدينة/العنوان: ${customer.cityAddress}`);
  if (customer.notes?.trim()) {
    lines.push(`ملاحظات: ${customer.notes.trim()}`);
  }
  lines.push("");
  lines.push("تفاصيل الطلب:");
  lines.push("");

  const supplierGroups = groupCartBySupplier(items);
  let grandTotal = 0;

  for (const [supplier, supplierItems] of supplierGroups) {
    lines.push(`المتجر: ${supplier}`);
    lines.push("");

    supplierItems.forEach((item, index) => {
      const unitPrice = item.product.price;
      const lineTotal = unitPrice * item.quantity;
      grandTotal += lineTotal;

      const isTextile = item.product.category === "textiles" || item.product.unit === "meter";
      const isAbaya = item.product.category === "abayas";

      // Arabic quantity wording: 1 متر, 2 متر, 3 أمتار and above
      const qtyDisplay = isTextile
        ? (item.quantity <= 2 ? `${item.quantity} متر` : `${item.quantity} أمتار`)
        : String(item.quantity);

      lines.push(`${index + 1}. المنتج: ${item.product.name}`);
      lines.push(`   الكمية: ${qtyDisplay}`);
      if (item.selectedSize) {
        lines.push(`   المقاس: ${item.selectedSize}`);
      }
      // Always show snap option for abayas (even "بدون طقطاق")
      if (isAbaya) {
        lines.push(`   طقطاق العباية: ${item.snapOption ?? "بدون طقطاق"}`);
      }
      lines.push(`   سعر القطعة: ${formatSar(unitPrice)}${isTextile ? " / متر" : ""}`);
      lines.push(`   الإجمالي: ${formatSar(lineTotal)}`);
      lines.push("");
    });

    lines.push("─────────────────────");
    lines.push("");
  }

  const shippingTotal = Object.values(shippingMap).reduce((a, b) => a + b, 0);
  const totalShipping = shippingTotal || supplierGroups.size * 30;

  lines.push(`إجمالي الشحن: ${totalShipping} ر.س`);
  if (discount && discount.amount > 0) {
    lines.push(`الخصم (${discount.code}): -${discount.amount} ر.س`);
  }
  lines.push(`رسوم المنصة: مجاناً`);
  lines.push(`الإجمالي الكلي: ${Math.max(0, grandTotal + totalShipping - (discount?.amount ?? 0))} ر.س`);
  lines.push("");
  lines.push("طريقة الدفع:");
  lines.push(PAYMENT_LABELS[paymentMethod] ?? paymentMethod);

  return lines.join("\n");
}

/** Builds wa.me link — customer opens it and sends to Fayid manually. */
export function getWhatsAppOrderUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp with prefilled order text.
 * Tries a new tab first; if blocked, navigates current tab to wa.me.
 */
export function openWhatsAppOrder(message: string): string {
  const url = getWhatsAppOrderUrl(message);

  if (import.meta.env.DEV) {
    console.log("[fayid] whatsappUrl", url);
  }

  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (popup === null) {
    window.location.href = url;
  }

  return url;
}
