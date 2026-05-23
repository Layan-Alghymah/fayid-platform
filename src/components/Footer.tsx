import { Link } from "wouter";
import { Twitter, Mail } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { SupplierJoinTextLink } from "@/components/SupplierJoinLink";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 mt-20 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Link href="/">
                <BrandLogo className="h-12 w-auto opacity-90 cursor-pointer" />
              </Link>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              المنصة السعودية الأولى لتداول فائض المنسوجات والأزياء. نربط المصانع والعلامات التجارية بالمشترين لتقليل الهدر وتعزيز الاستدامة.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-foreground font-bold mb-6 text-lg">المنصة</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/products?category=textiles" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  الأقمشة
                </Link>
              </li>
              <li>
                <Link href="/products?category=abayas" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  العبايات
                </Link>
              </li>
              <li>
                <Link href="/products?category=dresses" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  الفساتين
                </Link>
              </li>
            </ul>
          </div>

          {/* Suppliers */}
          <div>
            <h4 className="text-foreground font-bold mb-6 text-lg">الشركاء</h4>
            <ul className="space-y-3">
              <li>
                <SupplierJoinTextLink />
              </li>
              <li>
                <Link href="/supplier-terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  شروط الموردين
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  آلية العمل
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-foreground font-bold mb-6 text-lg">المساعدة</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  سياسة الإرجاع
                </Link>
              </li>
              <li>
                <a
                  href="mailto:Fayid.comp@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  تواصل معنا
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href="https://x.com/Fayidco_sa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:Fayid.comp@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} منصة فائض. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground/50">
            <span>صنع في السعودية 🇸🇦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
