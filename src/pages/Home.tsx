import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Box, CheckCircle, Percent, Recycle, Zap } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const { data: featuredData, isLoading } = useProducts({});

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-80 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/90 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6 animate-in" style={{ animationDelay: '0ms' }}>
              <Zap className="w-4 h-4" />
              <span>المنصة الأولى لفائض الأزياء في السعودية</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 animate-in" style={{ animationDelay: '100ms' }}>
              تسوق بذكاء، <br/>
              <span className="text-gradient-gold">وقلل الهدر.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg animate-in" style={{ animationDelay: '200ms' }}>
              نربطك بمخزون المصانع والعلامات التجارية الكبرى من الأقمشة والملابس الجاهزة بأسعار تنافسية وجودة عالية.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-in" style={{ animationDelay: '300ms' }}>
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto text-lg group">
                  تصفح المنتجات
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register?role=supplier">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg bg-black/20 backdrop-blur-sm">
                  انضم كمورد
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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
              <p className="text-muted-foreground">جميع الموردين معتمدين لضمان حصولك على أفضل الخامات والمنتجات.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-muted/10 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">تسوق حسب القسم</h2>
              <p className="text-muted-foreground">اكتشف الفئات المتاحة في المنصة</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'عباءات', img: '/products/abaya.png', category: 'عباءات' },
              { name: 'فساتين سهرة', img: '/products/evening-dress.png', category: 'فساتين' },
              { name: 'بدلات وقمصان', img: '/products/suit.png', category: 'بدلات' },
              { name: 'أقمشة ونسيج', img: '/products/cashmere-fabric.png', category: 'أقمشة' },
            ].map((cat, i) => (
              <Link key={i} href={`/products?category=${cat.category}`} className="group relative overflow-hidden rounded-2xl aspect-[4/5] block">
                {/* category placeholder */}
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-xl">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
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
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse" />
              ))}
            </div>
          ) : featuredData?.products && featuredData.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredData.products.slice(0, 8).map(product => (
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
      
      {/* Partners / Brands */}
      <section className="py-20 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">شركاؤنا</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3">علامات تجارية تثق بفائض</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">نفخر بشراكاتنا مع أبرز دور الأزياء والعلامات التجارية السعودية</p>
          </div>

          {/* Scrolling ticker */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="overflow-hidden">
              <div className="flex gap-6 animate-[marquee_30s_linear_infinite] w-max">
                {[
                  { name: "أروى البنوي", sub: "ARWA AL BANAWI", accent: "#c9a84c" },
                  { name: "هنيدة", sub: "HONAYDA", accent: "#195155" },
                  { name: "ليم", sub: "LEEM", accent: "#c9a84c" },
                  { name: "أوكتين", sub: "OKHTEIN", accent: "#0F3D4F" },
                  { name: "لما جوني", sub: "LAMA JOUNI", accent: "#c9a84c" },
                  { name: "سحر عطية", sub: "SAHAR ATIYA", accent: "#195155" },
                  { name: "نور فارس", sub: "NOOR FARES", accent: "#c9a84c" },
                  { name: "ديانا سلطان", sub: "DIANA SULTAN", accent: "#0F3D4F" },
                  { name: "أروى البنوي", sub: "ARWA AL BANAWI", accent: "#c9a84c" },
                  { name: "هنيدة", sub: "HONAYDA", accent: "#195155" },
                  { name: "ليم", sub: "LEEM", accent: "#c9a84c" },
                  { name: "أوكتين", sub: "OKHTEIN", accent: "#0F3D4F" },
                  { name: "لما جوني", sub: "LAMA JOUNI", accent: "#c9a84c" },
                  { name: "سحر عطية", sub: "SAHAR ATIYA", accent: "#195155" },
                  { name: "نور فارس", sub: "NOOR FARES", accent: "#c9a84c" },
                  { name: "ديانا سلطان", sub: "DIANA SULTAN", accent: "#0F3D4F" },
                ].map((brand, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-10 py-6 rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm hover:border-white/20 transition-all duration-300 min-w-[180px] group hover:scale-105"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-black mb-1"
                      style={{ background: `${brand.accent}22`, color: brand.accent }}
                    >
                      {brand.name[0]}
                    </div>
                    <p className="font-black text-sm text-foreground leading-tight">{brand.name}</p>
                    <p className="text-[9px] tracking-[0.25em] text-muted-foreground">{brand.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
            {[
              { val: "+500", label: "علامة تجارية موثوقة" },
              { val: "+٢٠٠K", label: "منتج متاح" },
              { val: "٩٨٪", label: "رضا الموردين" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-gradient-gold">{s.val}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Designers */}
      <section className="py-24 bg-muted/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">المصممون الشركاء</p>
            <h2 className="text-3xl md:text-4xl font-black mb-3">مصمّمونا</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">نتشرف بالتعاون مع نخبة من المصممين العالميين والمحليين لإيصال فائضهم إلى العالم</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                name: "يحيى البشري",
                nameEn: "YAHYA AL-BISHRI",
                title: "مصمم أزياء سعودي",
                bio: "أحد رواد الموضة السعودية، يجمع بين الهوية العربية والحداثة في تصاميمه للأزياء الفاخرة. بدأ مسيرته في باريس وعاد ليُحدث أثراً عميقاً في المشهد الإبداعي السعودي.",
                tags: ["عباءات فاخرة", "أزياء سهرة", "تصميم معاصر"],
                initials: "ي.ب",
                gradient: "from-[#0F3D4F] to-[#195155]",
                accentColor: "#c9a84c",
              },
              {
                name: "أليكسندر كابيلي",
                nameEn: "ALEXANDER CAPELLI",
                title: "مصمم إيطالي — دار كابيلي",
                bio: "مصمم إيطالي بارز أسس دار كابيلي في ميلانو عام ١٩٩٨. تميّزت تصاميمه بالأناقة الكلاسيكية المعاصرة ويتمتع بحضور واسع في أسواق الخليج والمملكة العربية السعودية.",
                tags: ["هوت كوتور", "أزياء رجالية", "دار أزياء"],
                initials: "A.C",
                gradient: "from-[#1a0a2e] to-[#2d1b69]",
                accentColor: "#a78bfa",
              },
            ].map((designer, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${designer.gradient} opacity-60`} />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_70%)]" />

                <div className="relative p-8 flex gap-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black border-2 shadow-xl"
                      style={{
                        background: `${designer.accentColor}22`,
                        borderColor: `${designer.accentColor}44`,
                        color: designer.accentColor,
                        fontFamily: "'Cairo', sans-serif",
                      }}
                    >
                      {designer.initials}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="text-xl font-black text-white">{designer.name}</h3>
                        <p className="text-[10px] tracking-[0.2em] text-white/50 font-mono uppercase">{designer.nameEn}</p>
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0 border"
                        style={{ background: `${designer.accentColor}20`, color: designer.accentColor, borderColor: `${designer.accentColor}30` }}
                      >
                        شريك
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-3" style={{ color: designer.accentColor }}>{designer.title}</p>
                    <p className="text-sm text-white/60 leading-relaxed mb-4">{designer.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {designer.tags.map(tag => (
                        <span key={tag} className="text-[11px] px-2.5 py-1 rounded-lg bg-white/8 text-white/60 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom decorative line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(to right, transparent, ${designer.accentColor}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/abstract-gold.png`} 
            alt="Gold Texture" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">لديك مخزون راكد؟</h2>
          <p className="text-lg text-white/80 mb-10">
            انضم لأكثر من 500 مصنع وعلامة تجارية يثقون في منصة فائض لتسييل مخزونهم بسرعة وكفاءة.
          </p>
          <Link href="/register?role=supplier">
            <Button size="lg" className="bg-white text-secondary hover:bg-white/90 text-lg font-bold px-10 h-14">
              سجل كمورد الآن
            </Button>
          </Link>
        </div>
      </section>

    </Layout>
  );
}
