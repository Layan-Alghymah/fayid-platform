/** @deprecated Backend removed — use Supabase or localStorage only */
export async function apiFetch(_path: string, _options?: RequestInit): Promise<never> {
  throw new Error("واجهة API غير متاحة — التطبيق يعمل عبر Supabase و localStorage فقط");
}
