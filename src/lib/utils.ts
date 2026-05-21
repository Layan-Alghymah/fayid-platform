import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(price: number, originalPrice: number) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
}

export function translateDiscountReason(reason?: string | null) {
  switch (reason) {
    case 'overstock': return 'فائض مخزون';
    case 'minor_defect': return 'عيب بسيط';
    case 'end_of_season': return 'نهاية الموسم';
    default: return reason || 'خصم خاص';
  }
}

export function translateOrderStatus(status: string) {
  switch (status) {
    case 'pending':   return 'تم استلام الطلب';
    case 'confirmed': return 'قيد التجهيز';
    case 'shipped':   return 'مع المندوب';
    case 'delivered': return 'تم التسليم';
    case 'cancelled': return 'ملغي';
    default:          return status;
  }
}

export function translatePaymentMethod(method?: string | null) {
  switch (method) {
    case 'mada':   return 'مدى';
    case 'tabby':  return 'تمارا / تمويلية';
    case 'stcpay': return 'STC Pay';
    case 'cod':    return 'الدفع عند الاستلام';
    default:       return method ?? '—';
  }
}

export function mockTrackingNumber(orderId: number) {
  return `FAD${String(orderId).padStart(8, '0')}SA`;
}

export function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}
