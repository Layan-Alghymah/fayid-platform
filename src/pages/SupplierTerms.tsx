import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="font-extrabold text-base mb-3 flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-black flex-shrink-0">
          {number}
        </span>
        {title}
      </h2>
      <div className="text-sm text-muted-foreground leading-relaxed pr-10 space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function SupplierTerms() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">الموردون</p>
          <h1 className="text-4xl font-extrabold mb-3">شروط وأحكام الموردين</h1>
          <p className="text-muted-foreground">
            يُرجى قراءة هذه الشروط بعناية قبل الانضمام كمورد في منصة فائض.
          </p>
          <p className="text-xs text-muted-foreground mt-4 border-t border-border/50 pt-3">
            آخر تحديث: مايو ٢٠٢٦ — منصة فائض، المملكة العربية السعودية.
          </p>
        </div>

        <div className="space-y-5">
          <Section number="١" title="التعريف بمنصة فائض">
            فائض هي منصة إلكترونية متخصصة في عرض وبيع المنتجات الفائضة من قطاع الأزياء والمنسوجات، بما يشمل المنتجات الموسمية، الفائض التشغيلي، والمنتجات ذات العيوب البسيطة أو التلف المحدود.
          </Section>

          <Section number="٢" title="مسؤولية المورد">
            <p>يقر المورد بأن جميع المعلومات والبيانات والمنتجات المرفوعة عبر المنصة صحيحة ودقيقة، وأنه يملك الحق الكامل في عرض وبيع هذه المنتجات.</p>
            <p>كما يتحمل المورد المسؤولية الكاملة عن:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>جودة المنتجات.</li>
              <li>دقة الصور والوصف.</li>
              <li>سلامة المنتجات المعروضة.</li>
              <li>الالتزام بالأنظمة واللوائح المعمول بها داخل المملكة العربية السعودية.</li>
            </ul>
          </Section>

          <Section number="٣" title="طبيعة المنتجات">
            <p>قد تتضمن بعض المنتجات المعروضة:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>فائض مخزون.</li>
              <li>منتجات نهاية موسم.</li>
              <li>عينات.</li>
              <li>منتجات تحتوي على عيوب أو تلف بسيط.</li>
            </ul>
            <p className="mt-2">ويتعهد المورد بتوضيح حالة المنتج بدقة وشفافية داخل وصف المنتج.</p>
          </Section>

          <Section number="٤" title="سياسة الطلبات">
            <p>تعمل منصة فائض كوسيط رقمي بين العميل والمورد، ويتم تنفيذ الطلبات والتجهيز والشحن من خلال المورد.</p>
            <p>وتحتفظ المنصة بحق:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>مراجعة أو إلغاء أي طلب عند الاشتباه بوجود مخالفة.</li>
              <li>إخفاء أو إزالة أي منتج مخالف.</li>
              <li>تعليق أو إيقاف المورد عند إساءة استخدام المنصة.</li>
            </ul>
          </Section>

          <Section number="٥" title="الشحن والتوصيل">
            <p>يتحمل المورد مسؤولية تجهيز وشحن الطلبات ضمن المدة المتفق عليها.</p>
            <p className="mt-1">كما قد تختلف رسوم الشحن حسب المدينة أو المورد أو نوع المنتج.</p>
          </Section>

          <Section number="٦" title="سياسة الدفع">
            <p>قد تتم عمليات الدفع عبر:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>التحويل البنكي.</li>
              <li>البطاقات الائتمانية ومدى.</li>
              <li>الدفع عند الاستلام (حسب توفر الخدمة).</li>
            </ul>
            <p className="mt-2">وتحتفظ المنصة بحق تحديث طرق الدفع المتاحة دون إشعار مسبق.</p>
          </Section>

          <Section number="٧" title="الخصوصية وحماية البيانات">
            تلتزم منصة فائض بحماية بيانات الموردين والعملاء وفقاً لأنظمة حماية البيانات المعمول بها في المملكة العربية السعودية، ولن يتم مشاركة البيانات مع أطراف ثالثة إلا بموافقة صريحة أو عند الاقتضاء القانوني.
          </Section>

          <Section number="٨" title="تعديل الشروط">
            تحتفظ منصة فائض بحق تعديل هذه الشروط في أي وقت، وسيتم إخطار الموردين بأي تغييرات جوهرية عبر البريد الإلكتروني المسجل.
          </Section>

          <Section number="٩" title="الاختصاص القضائي">
            تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتُحسم أي نزاعات أمام الجهات القضائية المختصة داخل المملكة.
          </Section>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-muted-foreground text-sm mb-4">مستعد للانضمام كمورد؟</p>
          <Link href="/join-supplier">
            <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
              قدّم طلب الانضمام
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
