import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, AlertCircle, MessageCircle, Package } from "lucide-react";

const SECTIONS = [
  {
    icon: Package,
    title: "طبيعة المنتجات الفائضة",
    content: [
      "المنتجات المعروضة على منصة فائض هي منتجات فائض مخزون أصلية من موردين معتمدين.",
      "قد تحتوي بعض المنتجات على اختلافات بسيطة كعدم انتظام الحجم أو ظلال لون طفيفة أو تغليف مختلف — وهذا مذكور دائماً في وصف المنتج.",
      "جميع المنتجات حقيقية وصالحة للاستخدام ما لم يُذكر خلاف ذلك صراحةً.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "سياسة الإرجاع والاستبدال",
    content: [
      "تخضع الطلبات لسياسة الإرجاع الخاصة بكل مورد، وتُوضَّح في صفحة المنتج أو عند التواصل.",
      "بعض المنتجات غير قابلة للإرجاع إذا تم توضيح ذلك صراحةً في وصف المنتج — مثل التخفيضات النهائية أو منتجات التصفية.",
      "يحق للعميل طلب الإرجاع خلال ٣ أيام من استلام المنتج إذا كان المنتج يختلف جوهرياً عمّا وُصف.",
    ],
  },
  {
    icon: AlertCircle,
    title: "حالات الإرجاع المقبولة",
    content: [
      "استلام منتج مختلف تماماً عما تم طلبه.",
      "وجود عيب جوهري غير مذكور في وصف المنتج.",
      "منتج تالف بسبب الشحن.",
    ],
  },
  {
    icon: MessageCircle,
    title: "كيفية تقديم طلب إرجاع",
    content: [
      "تواصل مع فريق فائض عبر البريد الإلكتروني: Fayid.comp@gmail.com",
      "أرفق رقم الطلب وصوراً للمنتج وسبب طلب الإرجاع.",
      "سيتم مراجعة طلبك والرد خلال ٢٤ ساعة.",
      "في حال قبول الإرجاع، يتم التنسيق مع المورد لاستلام المنتج وإتمام الاسترداد.",
    ],
  },
];

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
          <h1 className="text-4xl font-extrabold mb-3">سياسة الإرجاع</h1>
          <p className="text-muted-foreground">
            نسعى في فائض لضمان تجربة شراء واضحة وشفافة. يرجى قراءة سياسة الإرجاع أدناه بعناية.
          </p>
          <p className="text-xs text-muted-foreground mt-4 border-t border-border/50 pt-3">
            آخر تحديث: مايو ٢٠٢٦
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={i} className="glass-panel rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-extrabold">{section.title}</h2>
                </div>
                <ul className="space-y-2.5">
                  {section.content.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Contact box */}
        <div className="mt-10 bg-primary/5 border border-primary/15 rounded-2xl p-6 text-center">
          <p className="text-sm font-bold mb-1">هل لديك سؤال عن طلبك؟</p>
          <p className="text-muted-foreground text-sm mb-4">تواصل معنا وسنرد في أقرب وقت.</p>
          <a
            href="mailto:Fayid.comp@gmail.com"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
          >
            Fayid.comp@gmail.com
          </a>
        </div>
      </div>
    </Layout>
  );
}
