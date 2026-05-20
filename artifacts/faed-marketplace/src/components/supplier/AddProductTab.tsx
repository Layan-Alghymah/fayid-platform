import { useCreateProduct } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft, Package, DollarSign, Tag, ImageIcon, StickyNote, AlertCircle,
} from "lucide-react";
import {
  FormSection,
  FormField,
  SizeSelector,
  ConditionSelector,
  ImagePreviewInput,
} from "./form/ProductFormComponents";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "عباءات", "حجابات", "فساتين", "بدلات", "قمصان", "أقمشة", "إكسسوارات",
];

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name:              z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  category:          z.string().min(1, "التصنيف مطلوب"),
  description:       z.string().optional(),
  originalPrice:     z.coerce.number().min(1, "السعر الأصلي مطلوب"),
  price:             z.coerce.number().min(1, "سعر فائض مطلوب"),
  quantity:          z.coerce.number().int().min(1, "الكمية يجب أن تكون 1 على الأقل"),
  sizes:             z.array(z.string()).optional(),
  color:             z.string().optional(),
  condition:         z.string().min(1, "يرجى تحديد حالة المنتج"),
  defectDescription: z.string().optional(),
  imageUrl1:         z.string().optional(),
  imageUrl2:         z.string().optional(),
  imageUrl3:         z.string().optional(),
  supplierNotes:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddProductTabProps {
  onSuccess: () => void;
  onBack:    () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddProductTab({ onSuccess, onBack }: AddProductTabProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category:  "عباءات",
      condition: "",
      sizes:     [],
    },
  });

  const price         = Number(watch("price"))         || 0;
  const originalPrice = Number(watch("originalPrice")) || 0;
  const condition     = watch("condition");
  const discount      = originalPrice > 0 && price > 0 && price < originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;
  const priceAbove = price > 0 && originalPrice > 0 && price >= originalPrice;

  // ─── Mutation ────────────────────────────────────────────────────────────

  const createMut = useCreateProduct({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/supplier/products"] });
        queryClient.invalidateQueries({ queryKey: ["/api/supplier/stats"] });
        toast({ title: "تم النشر", description: "تم إضافة المنتج بنجاح" });
        reset();
        onSuccess();
      },
      onError: (e: any) => {
        toast({
          title: "خطأ في النشر",
          description: e?.message || "حدث خطأ أثناء إضافة المنتج",
          variant: "destructive",
        });
      },
    },
  });

  // ─── Submit handler ───────────────────────────────────────────────────────

  const onSubmit = (data: FormData) => {
    // Compose description from sub-fields
    const parts: string[] = [];
    if (data.description?.trim())       parts.push(data.description.trim());
    if (data.defectDescription?.trim()) parts.push(`وصف العيب: ${data.defectDescription.trim()}`);
    if (data.supplierNotes?.trim())     parts.push(`ملاحظات المورد: ${data.supplierNotes.trim()}`);
    const composedDescription = parts.join("\n\n") || null;

    // Pick first valid image URL
    const imageUrl =
      [data.imageUrl1, data.imageUrl2, data.imageUrl3]
        .map((u) => u?.trim())
        .find(Boolean) ?? null;

    createMut.mutate({
      data: {
        name:           data.name,
        category:       data.category,
        description:    composedDescription,
        price:          data.price,
        originalPrice:  data.originalPrice,
        quantity:       data.quantity,
        sizes:          data.sizes ?? [],
        brand:          data.color?.trim() || null,   // repurpose brand for اللون
        discountReason: data.condition,
        imageUrl:       imageUrl,
      },
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="animate-in fade-in duration-300 space-y-5">

      {/* Page header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-black">إضافة منتج جديد</h2>
          <p className="text-sm text-muted-foreground">انشر منتجاتك الفائضة للبيع على منصة فائض</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">

        {/* ══════════════════════════════════════════════════════ */}
        {/* Section 1 – Product info                              */}
        {/* ══════════════════════════════════════════════════════ */}
        <FormSection title="معلومات المنتج" icon={<Package className="w-4 h-4" />}>

          <FormField label="اسم المنتج" required error={errors.name?.message}>
            <Input
              {...register("name")}
              placeholder="مثال: عباءة حرير فاخرة 2024"
              className="h-11"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="التصنيف" required error={errors.category?.message}>
              <select
                {...register("category")}
                className="w-full bg-background/50 border border-border rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>

            <FormField label="اللون" hint="اختياري">
              <Input
                {...register("color")}
                placeholder="مثال: أبيض، بيج، أسود"
                className="h-11"
              />
            </FormField>
          </div>

          <FormField label="الوصف" hint="اختياري">
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-background/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none transition-colors placeholder:text-muted-foreground"
              placeholder="وصف تفصيلي للمنتج: الخامة، التصميم، المواصفات الفنية..."
            />
          </FormField>

          <FormField label="المقاسات المتوفرة" hint="اختياري">
            <SizeSelector control={control} name="sizes" />
          </FormField>

        </FormSection>

        {/* ══════════════════════════════════════════════════════ */}
        {/* Section 2 – Condition                                 */}
        {/* ══════════════════════════════════════════════════════ */}
        <FormSection title="حالة المنتج" icon={<Tag className="w-4 h-4" />}>

          <FormField label="اختر حالة المنتج" required error={errors.condition?.message}>
            <ConditionSelector control={control} name="condition" />
          </FormField>

          {/* Defect description – shown only for minor_defect */}
          {condition === "minor_defect" && (
            <FormField label="وصف العيب" hint="اختياري" error={errors.defectDescription?.message}>
              <div className="flex items-start gap-2 p-3 mb-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-orange-300 leading-relaxed">
                  يرجى وصف العيب بدقة حتى يتخذ المشتري قراراً مبنياً على معلومات كاملة
                </p>
              </div>
              <textarea
                {...register("defectDescription")}
                rows={3}
                className="w-full bg-background/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none transition-colors placeholder:text-muted-foreground"
                placeholder="مثال: خيط بارز في الطرف السفلي، غير مؤثر على الشكل العام..."
              />
            </FormField>
          )}

        </FormSection>

        {/* ══════════════════════════════════════════════════════ */}
        {/* Section 3 – Pricing & stock                           */}
        {/* ══════════════════════════════════════════════════════ */}
        <FormSection title="التسعير والمخزون" icon={<DollarSign className="w-4 h-4" />}>

          <div className="grid grid-cols-3 gap-4">
            <FormField label="السعر الأصلي (ر.س)" required error={errors.originalPrice?.message}>
              <Input
                type="number"
                min={0}
                step="0.01"
                {...register("originalPrice")}
                placeholder="500"
                className="h-11"
              />
            </FormField>

            <FormField label="سعر فائض (ر.س)" required error={errors.price?.message}>
              <Input
                type="number"
                min={0}
                step="0.01"
                {...register("price")}
                placeholder="350"
                className="h-11"
              />
            </FormField>

            <FormField label="الكمية (قطعة)" required error={errors.quantity?.message}>
              <Input
                type="number"
                min={1}
                step="1"
                {...register("quantity")}
                placeholder="50"
                className="h-11"
              />
            </FormField>
          </div>

          {/* Discount preview */}
          {discount > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20">
              <span className="text-[#c9a84c] text-sm font-black">خصم {discount}%</span>
              <span className="text-xs text-muted-foreground">على السعر الأصلي — سيظهر هذا للمشترين</span>
            </div>
          )}

          {/* Price warning */}
          {priceAbove && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-xs text-red-300">
                سعر فائض يجب أن يكون أقل من السعر الأصلي
              </span>
            </div>
          )}

        </FormSection>

        {/* ══════════════════════════════════════════════════════ */}
        {/* Section 4 – Images                                    */}
        {/* ══════════════════════════════════════════════════════ */}
        <FormSection title="صور المنتج" icon={<ImageIcon className="w-4 h-4" />}>

          <p className="text-xs text-muted-foreground -mt-2">
            أضف روابط صور المنتج. الصورة الأولى الصالحة ستُستخدم كصورة رئيسية.
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">الصورة الأولى (رئيسية)</p>
              <ImagePreviewInput
                control={control}
                name="imageUrl1"
                placeholder="https://example.com/image1.jpg"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">الصورة الثانية (اختياري)</p>
              <ImagePreviewInput
                control={control}
                name="imageUrl2"
                placeholder="https://example.com/image2.jpg"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">الصورة الثالثة (اختياري)</p>
              <ImagePreviewInput
                control={control}
                name="imageUrl3"
                placeholder="https://example.com/image3.jpg"
              />
            </div>
          </div>

        </FormSection>

        {/* ══════════════════════════════════════════════════════ */}
        {/* Section 5 – Supplier notes                            */}
        {/* ══════════════════════════════════════════════════════ */}
        <FormSection title="ملاحظات المورد" icon={<StickyNote className="w-4 h-4" />}>

          <FormField label="ملاحظات اختيارية للمشتري">
            <textarea
              {...register("supplierNotes")}
              rows={3}
              className="w-full bg-background/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none transition-colors placeholder:text-muted-foreground"
              placeholder="مثال: التوصيل خلال 3 أيام عمل، التعبئة محكمة، يمكن التوصيل خارج المملكة..."
            />
          </FormField>

        </FormSection>

        {/* ══════════════════════════════════════════════════════ */}
        {/* Actions                                               */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="flex gap-3 pb-8">
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            disabled={createMut.isPending}
          >
            {createMut.isPending ? "جارٍ النشر..." : "نشر المنتج"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onBack}
            disabled={createMut.isPending}
          >
            إلغاء
          </Button>
        </div>

      </form>
    </div>
  );
}
