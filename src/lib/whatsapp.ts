import type { CartItem } from "@/hooks/useCart";

/** International format — 0559433431 → 966559433431 */
export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER ?? "966559433431").replace(/\D/g, "") ||
  "966559433431";

export type WhatsAppCheckoutCustomer = {
  name: string;
  phone: string;
  cityAddress: string;
  notes?: string;
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
 */
export function buildWhatsAppOrderMessage(
  items: CartItem[],
  customer: WhatsAppCheckoutCustomer
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
  let overallTotal = 0;

  for (const [supplier, supplierItems] of supplierGroups) {
    lines.push(`المتجر: ${supplier}`);
    lines.push("");

    let supplierSubtotal = 0;

    supplierItems.forEach((item, index) => {
      const unitPrice = item.product.price;
      const lineTotal = unitPrice * item.quantity;
      supplierSubtotal += lineTotal;

      lines.push(`${index + 1}. المنتج: ${item.product.name}`);
      lines.push(`   الكمية: ${item.quantity}`);
      lines.push(`   سعر القطعة: ${formatSar(unitPrice)}`);
      lines.push(`   الإجمالي: ${formatSar(lineTotal)}`);
      lines.push("");
    });

    lines.push(`إجمالي متجر ${supplier}: ${formatSar(supplierSubtotal)}`);
    lines.push("");
    overallTotal += supplierSubtotal;
  }

  lines.push(`الإجمالي الكلي: ${formatSar(overallTotal)}`);
  lines.push("");
  lines.push("ملاحظة الشحن:");
  lines.push("سيتم تأكيد تكلفة الشحن وموعد التوصيل عبر الواتساب.");

  return lines.join("\n");
}

/** Opens WhatsApp with encoded order text. */
export function openWhatsAppOrder(message: string): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.href = url;
  }
}
