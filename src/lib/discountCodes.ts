import { supabase } from "@/lib/supabase";

export type DiscountCode = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
};

export type DiscountResult =
  | { valid: true; code: DiscountCode; amount: number }
  | { valid: false; error: string };

export async function validateDiscountCode(
  code: string,
  subtotal: number
): Promise<DiscountResult> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { valid: false, error: "يرجى إدخال كود الخصم" };

  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .eq("code", trimmed)
    .single();

  if (error || !data) {
    return { valid: false, error: "كود الخصم غير صحيح" };
  }

  if (!data.is_active) {
    return { valid: false, error: "كود الخصم غير متاح" };
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: "انتهت صلاحية كود الخصم" };
  }

  const amount = calculateDiscountAmount(data as DiscountCode, subtotal);
  return { valid: true, code: data as DiscountCode, amount };
}

export function calculateDiscountAmount(
  code: DiscountCode,
  subtotal: number
): number {
  if (code.type === "percentage") {
    return Math.min(Math.round((subtotal * code.value) / 100), subtotal);
  }
  return Math.min(code.value, subtotal);
}
