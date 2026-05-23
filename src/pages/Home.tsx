import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Box,
  CheckCircle,
  Percent,
  Recycle,
  Zap,
  Quote,
  ExternalLink,
  ChevronDown,
  Store,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { SupplierJoinLink } from "@/components/SupplierJoinLink";
import { supabase, type Supplier } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Category config ────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: "فساتين",
    catSlug: "dresses",
    dbCategory: "dresses",
    fallbackLocal: "/products/evening-dress.png",
    href: "/products?category=dresses",
  },
  {
    name: "عبايات",
    catSlug: "abayas",
    dbCategory: "abayas",
    fallbackLocal: "/products/abaya.png",
    href: "/products?category=abayas",
  },
  {
    name: "أقمشة",
    catSlug: "textiles",
    dbCategory: "textiles",
    fallbackLocal: "/products/cashmere-fabric.png",
    href: "/products?category=textiles",
  },
];

// ─── FAQ data ────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "ما هي منصة فائض؟",
    a: "فائض هي منصة إلكترونية سعودية متخصصة في تداول المنتجات الفائضة من قطاع الأزياء والنسيج. نربط الموردين والمصانع بالمشترين للتخلص من المخزون الراكد بأسعار تنافسية.",
  },
  {
    q: "هل المنتجات جديدة؟",
    a: "نعم، معظم المنتجات جديدة غير مستخدمة — لكنها قد تكون فائض مخزون أو نهاية موسم أو عينات. يوضح كل مورد حالة منتجاته بشكل صريح في الوصف.",
  },
  {
    q: "كيف يتم الشحن؟",
    a: "يتولى المورد مباشرةً تجهيز وشحن الطلب. تُحسَب رسوم الشحن حسب مدينة المورد ومدينة العميل وتُعرض تفصيلياً عند إتمام الطلب.",
  },
  {
    q: "كيف يمكنني الانضمام كمورد؟",
    a: "يمكن لأي مورد أو مصنع أو متجر لديه مخزون فائض التقديم للانضمام عبر صفحة \"انضم كمورد\". يراجع فريق فائض الطلب ويتواصل معك.",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: featuredData, isLoading } = useProducts({});

  // Load active suppliers for the trusted brands section
  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["suppliers-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("suppliers")
        .select("id, name, type")
        .eq("is_active", true)
        .order("id");
      return (data ?? []) as Supplier[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Pick first product image per DB category
  const categoryImage = (dbCat: string, fallback: string): string => {
    const match = featuredData?.products?.find(
      (p) => p.category === dbCat && p.imageUrl
    );
    return match?.imageUrl ?? fallback;
  };

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="hero-bg-light absolute inset-0" role="img" aria-label="Hero Background" />
          <div className="hero-bg-dark absolute inset-0">
            <img
              src="/images/hero-bg.png"
              alt=""
              className="w-full h-full object-cover opacity-80 mix-blend-screen"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-background/90 to-transparent" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6 animate-in"
              style={{ animationDelay: "0ms" }}
            >
              <Zap className="w-4 h-4" />
              <span>المنصة الأولى لفائض الأزياء في السعودية</span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 animate-in"
              style={{ animationDelay: "100ms" }}
            >
              تسوق بذكاء، <br />
              <span className="text-gradient-gold">وقلل الهدر.</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg animate-in"
              style={{ animationDelay: "200ms" }}
            >
              نربطك بمخزون المصانع والعلامات التجارية من الأقمشة والملابس والعبايات بأسعار تنافسية وجودة أصلية.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-in"
              style={{ animationDelay: "300ms" }}
            >
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto text-lg group">
                  تصفح المنتجات
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
              <SupplierJoinLink
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg bg-black/20 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 relative z-20 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Percent className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">خصومات تصل لـ 70%</h3>
              <p className="text-muted-foreground">أسعار حصرية على الفائض من المصانع والمتاجر الكبرى بجودة أصلية.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Recycle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">تعزيز الاستدامة</h3>
              <p className="text-muted-foreground">ساهم في تقليل الهدر في قطاع النسيج من خلال تدوير المخزون الراكد.</p>
            </div>
            <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">جودة مضمونة</h3>
              <p className="text-muted-foreground">جميع الموردين معتمدون لضمان حصولك على أفضل الخامات والمنتجات.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-20 bg-muted/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">تسوق حسب القسم</h2>
            <p className="text-muted-foreground">اكتشف الفئات المتاحة في المنصة</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const imgSrc = categoryImage(cat.dbCategory, `/images/categories/${cat.catSlug}.jpg`);
              return (
                <Link
                  key={cat.catSlug}
                  href={cat.href}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
                >
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to local product image if dynamic/category image fails
                      if (e.currentTarget.src !== cat.fallbackLocal) {
                        e.currentTarget.src = cat.fallbackLocal;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white font-extrabold text-2xl">{cat.name}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">أحدث العروض</h2>
              <p className="text-muted-foreground">فرص لا تفوت من مصانع وماركات موثوقة</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="hidden sm:flex">عرض الكل</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse" />
              ))}
            </div>
          ) : featuredData?.products && featuredData.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredData.products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-panel rounded-2xl">
              <Box className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground">لا توجد منتجات حالياً</h3>
              <p className="text-muted-foreground mt-2">ستتوفر المنتجات قريباً، عد لاحقاً.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Trusted Suppliers — infinite marquee ── */}
      {suppliers.length > 0 && (
        <section className="py-20 border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">شركاؤنا</p>
            <h2 className="text-3xl font-black mb-2">علامات تثق بمنصة فائض</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              موردون معتمدون يساهمون في تقليل الهدر وتعزيز الاستدامة
            </p>
          </div>

          <div className="relative">
            {/* Fade edges */}
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

            {/* Marquee track — items duplicated for seamless loop */}
            <div
              className="flex gap-5 w-max"
              style={{ animation: "marquee 22s linear infinite" }}
            >
              {[...suppliers, ...suppliers].map((s, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex flex-col items-center justify-center gap-2.5 px-8 py-5 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm min-w-[160px] hover:border-primary/30 transition-colors"
                >
                  {/* First letter always visible; image overlays if it loads */}
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center overflow-hidden relative text-primary font-black text-lg">
                    <span>{s.name[0]}</span>
                    <img
                      src={`/images/suppliers/${s.id}.png`}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </div>
                  <p className="font-bold text-sm text-center leading-tight whitespace-nowrap">
                    {s.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonial ── */}
      <section className="py-24 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">آراء وإشادات</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3">ماذا قيل عن فائض</h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative glass-panel rounded-3xl p-8 md:p-10 border border-white/10 hover:border-primary/20 transition-colors group">
              {/* Gold quote mark */}
              <div className="absolute -top-5 right-8">
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-[#c9a84c]" />
                </div>
              </div>

              <blockquote className="text-lg md:text-xl font-semibold leading-relaxed text-foreground mb-8 mt-2">
                "فائض فكرة ذكية تعالج مشكلة حقيقية في قطاع الأزياء — تسييل المخزون الراكد بطريقة مستدامة ومنظّمة."
              </blockquote>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c] font-black text-base">
                    ن.م
                  </div>
                  <div>
                    <p className="font-extrabold text-foreground">د. نادر المطيري</p>
                    <p className="text-xs text-muted-foreground">X (تويتر)</p>
                  </div>
                </div>

                <a
                  href="https://x.com/Fayidco_sa/status/2053796307425231013?s=20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="gap-2 border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:border-[#c9a84c]/50">
                    <ExternalLink className="w-4 h-4" />
                    عرض المنشور
                  </Button>
                </a>
              </div>

              {/* Gold accent bottom line */}
              <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/abstract-gold.png`}
            alt="Gold Texture"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="cta-section-overlay absolute inset-0 bg-secondary/80 backdrop-blur-sm" />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">لديك مخزون راكد؟</h2>
          <p className="text-lg text-white/80 mb-4 max-w-2xl mx-auto">
            انضم إلى منصة فائض وساهم في تسريع بيع المنتجات الفائضة وتعزيز الاستدامة وتقليل الهدر.
          </p>
          {/* Launch badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c9a84c]/15 border border-[#c9a84c]/30 text-[#c9a84c] text-sm font-bold mb-8">
            <Store className="w-3.5 h-3.5" />
            0% عمولة حالياً لفترة الإطلاق
          </div>
          <div className="flex justify-center">
            <SupplierJoinLink
              size="lg"
              className="bg-white text-[#0F3D4F] hover:bg-white/90 text-lg font-bold px-10 h-14"
            >
              انضم كمورد
            </SupplierJoinLink>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-muted/5 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">الدعم</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3">الأسئلة الشائعة</h2>
            <p className="text-muted-foreground">كل ما تحتاج معرفته عن منصة فائض</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="glass-panel rounded-2xl border border-white/8 px-6 py-1 data-[state=open]:border-primary/20"
              >
                <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline hover:text-primary transition-colors py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-sm">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground text-sm">
              لم تجد إجابتك؟{" "}
              <a
                href="mailto:Fayid.comp@gmail.com"
                className="text-primary font-semibold hover:underline"
              >
                تواصل معنا
              </a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
