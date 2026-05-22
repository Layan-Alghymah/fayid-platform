import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsModal({ open, onClose }: TermsModalProps) {
  // Lock scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        dir="rtl"
        className="relative w-full max-w-2xl max-h-[88vh] flex flex-col bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2
            id="terms-title"
            className="text-xl font-extrabold text-foreground"
          >
            شروط وأحكام منصة فائض
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-6 text-sm leading-relaxed space-y-6 text-foreground">

          <TermsSection number="1" title="التعريف بمنصة فائض">
            فائض هي منصة إلكترونية متخصصة في عرض وبيع المنتجات الفائضة من قطاع الأزياء والمنسوجات، بما يشمل المنتجات الموسمية، الفائض التشغيلي، والمنتجات ذات العيوب البسيطة أو التلف المحدود.
          </TermsSection>

          <TermsSection number="2" title="مسؤولية المورد">
            <p>
              يقر المورد بأن جميع المعلومات والبيانات والمنتجات المرفوعة عبر المنصة صحيحة ودقيقة، وأنه يملك الحق الكامل في عرض وبيع هذه المنتجات.
            </p>
            <p className="mt-3">كما يتحمل المورد المسؤولية الكاملة عن:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground pr-2">
              <li>جودة المنتجات.</li>
              <li>دقة الصور والوصف.</li>
              <li>سلامة المنتجات المعروضة.</li>
              <li>الالتزام بالأنظمة واللوائح المعمول بها داخل المملكة العربية السعودية.</li>
            </ul>
          </TermsSection>

          <TermsSection number="3" title="طبيعة المنتجات">
            <p>قد تتضمن بعض المنتجات المعروضة:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground pr-2">
              <li>فائض مخزون.</li>
              <li>منتجات نهاية موسم.</li>
              <li>عينات.</li>
              <li>منتجات تحتوي على عيوب أو تلف بسيط.</li>
            </ul>
            <p className="mt-3">
              ويتعهد المورد بتوضيح حالة المنتج بدقة وشفافية داخل وصف المنتج.
            </p>
          </TermsSection>

          <TermsSection number="4" title="سياسة الطلبات">
            <p>
              تعمل منصة فائض كوسيط رقمي بين العميل والمورد، ويتم تنفيذ الطلبات والتجهيز والشحن من خلال المورد.
            </p>
            <p className="mt-3">وتحتفظ المنصة بحق:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground pr-2">
              <li>مراجعة أو إلغاء أي طلب عند الاشتباه بوجود مخالفة.</li>
              <li>إخفاء أو إزالة أي منتج مخالف.</li>
              <li>تعليق أو إيقاف المورد عند إساءة استخدام المنصة.</li>
            </ul>
          </TermsSection>

          <TermsSection number="5" title="الشحن والتوصيل">
            <p>
              يتحمل المورد مسؤولية تجهيز وشحن الطلبات ضمن المدة المتفق عليها.
            </p>
            <p className="mt-2">
              كما قد تختلف رسوم الشحن حسب المدينة أو المورد أو نوع المنتج.
            </p>
          </TermsSection>

          <TermsSection number="6" title="سياسة الدفع">
            <p>قد تتم عمليات الدفع عبر:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground pr-2">
              <li>التحويل البنكي.</li>
              <li>البطاقات الائتمانية ومدى.</li>
              <li>الدفع عند الاستلام (حسب توفر الخدمة).</li>
            </ul>
            <p className="mt-3">
              وتحتفظ المنصة بحق تحديث طرق الدفع المتاحة دون إشعار مسبق.
            </p>
          </TermsSection>

          <TermsSection number="7" title="الخصوصية وحماية البيانات">
            تلتزم منصة فائض بحماية بيانات الموردين والعملاء وفقاً لأنظمة حماية البيانات المعمول بها في المملكة العربية السعودية، ولن يتم مشاركة البيانات مع أطراف ثالثة إلا بموافقة صريحة أو عند الاقتضاء القانوني.
          </TermsSection>

          <TermsSection number="8" title="تعديل الشروط">
            تحتفظ منصة فائض بحق تعديل هذه الشروط في أي وقت، وسيتم إخطار الموردين بأي تغييرات جوهرية عبر البريد الإلكتروني المسجل.
          </TermsSection>

          <TermsSection number="9" title="الاختصاص القضائي">
            تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتُحسم أي نزاعات أمام الجهات القضائية المختصة داخل المملكة.
          </TermsSection>

          <p className="text-xs text-muted-foreground pt-4 border-t border-border">
            آخر تحديث: مايو 2026 — منصة فائض، المملكة العربية السعودية.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex-shrink-0 flex justify-end">
          <Button onClick={onClose} size="sm">
            فهمت وأغلق
          </Button>
        </div>
      </div>
    </div>
  );
}

function TermsSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-bold text-base mb-2 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-black flex-shrink-0">
          {number}
        </span>
        {title}
      </h3>
      <div className="text-muted-foreground pr-8">{children}</div>
    </div>
  );
}
