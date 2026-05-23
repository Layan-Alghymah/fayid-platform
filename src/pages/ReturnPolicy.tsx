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

export default function ReturnPolicy() {
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
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">السياسات</p>
          <h1 className="text-4xl font-extrabold mb-3">سياسة الإرجاع والاستبدال — منصة فائض</h1>
          <p className="text-muted-foreground leading-relaxed">
            نسعى في منصة فائض إلى تقديم تجربة شراء واضحة وموثوقة، ونرجو من العملاء الكرام قراءة سياسة الإرجاع والاستبدال بعناية قبل إتمام الطلب.
          </p>
          <p className="text-xs text-muted-foreground mt-4 border-t border-border/50 pt-3">
            آخر تحديث: مايو 2026م
          </p>
        </div>

        <div className="space-y-5">
          <Section number="١" title="طبيعة المنتجات المعروضة">
            <p>المنتجات المعروضة عبر منصة فائض هي منتجات فائض مخزون أصلية مقدمة من موردين مستقلين ومعتمدين على المنصة.</p>
            <p className="mt-2">وقد تتضمن بعض المنتجات:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>اختلافات بسيطة في درجات اللون.</li>
              <li>اختلافات طفيفة في المقاسات أو التغليف.</li>
              <li>عيوب بسيطة أو آثار تخزين.</li>
              <li>منتجات موسمية أو تصفية نهائية.</li>
            </ul>
            <p className="mt-2">ويتم توضيح حالة المنتج ووصفه قدر الإمكان داخل صفحة المنتج.</p>
            <p className="mt-2">ويُقر العميل عند إتمام الشراء باطلاعه على وصف المنتج وموافقته على حالته المعروضة.</p>
          </Section>

          <Section number="٢" title="دور منصة فائض">
            <p>تعمل منصة فائض كوسيط إلكتروني بين العميل والمورد، بينما تقع مسؤولية المنتج وجودته وتجهيزه وشحنه على المورد.</p>
            <p className="mt-2">وتحتفظ المنصة بحق مراجعة طلبات الإرجاع والتنسيق مع المورد واتخاذ القرار المناسب وفق هذه السياسة.</p>
          </Section>

          <Section number="٣" title="المنتجات غير القابلة للإرجاع">
            <p>لا يمكن إرجاع أو استبدال المنتجات في الحالات التالية:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>إذا تم استخدام المنتج أو غسله أو تعديله.</li>
              <li>إذا تغيرت حالة المنتج بعد الاستلام.</li>
              <li>إذا كانت المشكلة موضحة مسبقًا في وصف المنتج.</li>
              <li>منتجات التصفية النهائية أو المنتجات المعلنة كغير قابلة للإرجاع.</li>
              <li>الطلبات المصنوعة أو المجهزة حسب الطلب — إن وجدت.</li>
            </ul>
          </Section>

          <Section number="٤" title="حالات الإرجاع المقبولة">
            <p>يحق للعميل طلب الإرجاع خلال مدة أقصاها <strong>(3) أيام</strong> من تاريخ استلام الطلب، وذلك في الحالات التالية فقط:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>استلام منتج مختلف بشكل جوهري عن المنتج المطلوب.</li>
              <li>وجود عيب جوهري غير موضح في وصف المنتج.</li>
              <li>وصول المنتج متضررًا بشكل واضح نتيجة الشحن.</li>
            </ul>
            <p className="mt-2">ويحق للمنصة أو المورد طلب صور أو معلومات إضافية قبل قبول الطلب.</p>
          </Section>

          <Section number="٥" title="آلية تقديم طلب الإرجاع">
            <p>لتقديم طلب إرجاع، يُرجى التواصل عبر البريد الإلكتروني:</p>
            <p className="mt-2">
              <a href="mailto:Fayid.comp@gmail.com" className="text-primary font-semibold hover:underline">
                Fayid.comp@gmail.com
              </a>
            </p>
            <p className="mt-2">مع إرفاق:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>رقم الطلب.</li>
              <li>صور واضحة للمنتج.</li>
              <li>وصف المشكلة أو سبب طلب الإرجاع.</li>
            </ul>
            <p className="mt-2">وسيتم مراجعة الطلب والرد خلال مدة تقديرية تصل إلى 24–72 ساعة عمل.</p>
          </Section>

          <Section number="٦" title="الاسترداد المالي">
            <p>في حال الموافقة على طلب الإرجاع:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>يتم التنسيق لاستلام المنتج.</li>
              <li>يتم فحص المنتج والتأكد من حالته.</li>
              <li>يُعاد المبلغ عبر وسيلة الدفع الأصلية متى أمكن ذلك.</li>
            </ul>
            <p className="mt-2">وقد تستغرق عملية الاسترداد عدة أيام عمل بحسب البنك أو مزود خدمة الدفع.</p>
            <p className="mt-2">وتحتفظ المنصة بحق خصم رسوم الشحن أو أي تكاليف تشغيلية في الحالات التي لا يكون فيها الخطأ من المورد أو المنصة.</p>
          </Section>

          <Section number="٧" title="رفض طلبات الإرجاع">
            <p>يحق للمنصة أو المورد رفض طلب الإرجاع في الحالات التالية:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pr-2">
              <li>عدم الالتزام بالمدة المحددة.</li>
              <li>عدم تقديم إثبات واضح للمشكلة.</li>
              <li>استخدام المنتج أو تلفه بعد الاستلام.</li>
              <li>مخالفة شروط هذه السياسة.</li>
            </ul>
          </Section>

          <Section number="٨" title="التواصل والدعم">
            <p>في حال وجود أي استفسار بخصوص الطلبات أو الإرجاع، يمكن التواصل مع فريق فائض عبر البريد الإلكتروني:</p>
            <p className="mt-2">
              <a href="mailto:Fayid.comp@gmail.com" className="text-primary font-semibold hover:underline">
                Fayid.comp@gmail.com
              </a>
            </p>
            <p className="mt-2">وسيتم الرد في أقرب وقت ممكن.</p>
          </Section>
        </div>

        {/* Back home button */}
        <div className="mt-12 text-center">
          <Link href="/">
            <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors cursor-pointer">
              <ArrowRight className="w-4 h-4" />
              العودة للرئيسية
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
