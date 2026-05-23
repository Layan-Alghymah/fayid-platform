import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { ArrowLeft, Upload, Search, ShoppingBag, MessageCircle, Truck, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: Upload,
    number: "١",
    title: "يرفع المورد المنتجات الفائضة",
    desc: "يقوم المورد بتسجيل منتجاته الفائضة على المنصة — سواء كانت فائض مخزون، نهاية موسم، أو عينات — مع صور وأسعار واضحة.",
    accent: "#c9a84c",
  },
  {
    icon: Search,
    number: "٢",
    title: "يتصفح العميل المنتجات",
    desc: "يتصفح المشتري المنتجات عبر فئات منظّمة — فساتين، عبايات، أقمشة — بأسعار تنافسية وجودة أصلية.",
    accent: "#195155",
  },
  {
    icon: ShoppingBag,
    number: "٣",
    title: "يتم الطلب عبر المنصة",
    desc: "يختار العميل المنتجات، يضيفها للسلة، ويكمل بيانات الطلب مع اختيار طريقة الشحن المناسبة.",
    accent: "#c9a84c",
  },
  {
    icon: MessageCircle,
    number: "٤",
    title: "يتم التواصل والتجهيز",
    desc: "يُرسَل الطلب مباشرة للمورد عبر واتساب لتأكيده وتجهيز المنتجات — بسرعة وشفافية تامة.",
    accent: "#195155",
  },
  {
    icon: Truck,
    number: "٥",
    title: "الشحن من خلال المورد",
    desc: "يتولى المورد شحن الطلب وتوصيله للعميل ضمن المدة المتفق عليها. رسوم الشحن تُحدَّد حسب الموقع والمورد.",
    accent: "#c9a84c",
  },
  {
    icon: Leaf,
    number: "٦",
    title: "تقليل الهدر وتعزيز الاستدامة",
    desc: "كل عملية شراء تساهم في تقليل المخزون الراكد وتعزيز الاستدامة في قطاع الأزياء والنسيج بالمملكة.",
    accent: "#195155",
  },
];

export default function HowItWorks() {
  return (
    <Layout>
      <div dir="rtl" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-4">المنصة</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">آلية عمل فائض</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            منصة فائض تربط الموردين بالمشترين لتسريع بيع المنتجات الفائضة وتقليل الهدر.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />

          <div className="space-y-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-6 items-start group">
                  {/* Step circle */}
                  <div
                    className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-black border-2 z-10 transition-transform group-hover:scale-110"
                    style={{
                      background: `${step.accent}18`,
                      borderColor: `${step.accent}44`,
                      color: step.accent,
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Content card */}
                  <div className="flex-1 glass-panel rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${step.accent}18` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: step.accent }} />
                      </div>
                      <h2 className="text-lg font-extrabold">{step.title}</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center glass-panel rounded-3xl p-10">
          <h3 className="text-2xl font-extrabold mb-3">مستعد للانضمام؟</h3>
          <p className="text-muted-foreground mb-6">
            سواء كنت مشترياً يبحث عن أفضل الأسعار، أو مورداً يريد تسييل مخزونه — فائض هو مكانك.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                تصفح المنتجات
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/join-supplier">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                انضم كمورد
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
