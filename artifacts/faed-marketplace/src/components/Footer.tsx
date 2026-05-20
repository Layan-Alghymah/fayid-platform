import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 mt-20 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <img 
              src={`${import.meta.env.BASE_URL}logo-light.png`} 
              alt="Faed" 
              className="h-12 w-auto mb-6 opacity-90"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}logo-dark.png`;
              }}
            />
            <p className="text-muted-foreground text-sm leading-relaxed">
              المنصة السعودية الأولى لتداول فائض المنسوجات والأزياء. نربط المصانع والعلامات التجارية بالمشترين لتقليل الهدر وتعزيز الاستدامة.
            </p>
          </div>
          
          <div>
            <h4 className="text-foreground font-bold mb-6 text-lg">المنصة</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm">جميع المنتجات</Link></li>
              <li><Link href="/products?category=textiles" className="text-muted-foreground hover:text-primary transition-colors text-sm">الأقمشة</Link></li>
              <li><Link href="/products?category=apparel" className="text-muted-foreground hover:text-primary transition-colors text-sm">الملابس الجاهزة</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-bold mb-6 text-lg">الشركاء</h4>
            <ul className="space-y-3">
              <li><Link href="/register?role=supplier" className="text-muted-foreground hover:text-primary transition-colors text-sm">سجل كمورد</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">شروط الموردين</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">آلية العمل</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-bold mb-6 text-lg">المساعدة</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">الأسئلة الشائعة</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">سياسة الإرجاع</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">اتصل بنا</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} منصة فائض. جميع الحقوق محفوظة.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-muted-foreground/50">صنع في السعودية 🇸🇦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
