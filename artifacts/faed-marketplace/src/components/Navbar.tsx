import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Search, Menu, User as UserIcon, LogOut, Package, ClipboardList } from "lucide-react";
import { Button } from "./ui/Button";
import { useGetCart } from "@workspace/api-client-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cart } = useGetCart({
    query: { enabled: isAuthenticated }
  });

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img 
                src={`${import.meta.env.BASE_URL}logo-dark-landscape.png`} 
                alt="Faed Platform" 
                className="h-10 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}logo-dark.png`;
                }}
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className={cn("text-sm font-semibold hover:text-primary transition-colors", location === "/products" ? "text-primary" : "text-foreground")}>
                تصفح المنتجات
              </Link>
              <Link href="/products?category=أقمشة" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                أقمشة
              </Link>
              <Link href="/products?category=فساتين" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                ملابس
              </Link>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="ابحث عن أقمشة، ماركات، مصانع..." 
                className="w-full bg-black/20 border border-white/10 rounded-full py-2.5 pr-12 pl-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white placeholder:text-white/40"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'buyer' && (
                  <Link href="/orders">
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-white/5 rounded-full" title="طلباتي">
                      <ClipboardList className="w-5 h-5" />
                    </Button>
                  </Link>
                )}

                {user?.role !== 'supplier' && (
                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-white/5 rounded-full">
                      <ShoppingCart className="w-5 h-5" />
                      {cartItemsCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                          {cartItemsCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}

                <div className="hidden sm:flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-foreground">{user?.name}</span>
                    <span className="text-[10px] text-primary">{user?.role === 'buyer' ? 'مشتري' : user?.role === 'supplier' ? 'مورد' : 'مدير'}</span>
                  </div>
                  
                  {user?.role === 'supplier' && (
                    <Link href="/supplier">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full" title="لوحة المورد">
                        <Package className="w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive hover:bg-white/5 rounded-full" title="تسجيل الخروج">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-white/5">تسجيل الدخول</Button>
                </Link>
                <Link href="/register">
                  <Button>حساب جديد</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-foreground hover:bg-white/5 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/5 animate-in absolute w-full left-0 top-20 shadow-2xl">
          <div className="px-4 py-6 flex flex-col gap-4">
            <Link href="/products" className="text-base font-bold text-foreground py-2 border-b border-white/5">
              تصفح المنتجات
            </Link>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-3 mt-4">
                <Link href="/login"><Button variant="outline" className="w-full">تسجيل الدخول</Button></Link>
                <Link href="/register"><Button className="w-full">حساب جديد</Button></Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                {user?.role === 'buyer' && (
                  <Link href="/orders" className="text-foreground py-2 font-semibold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4"/> طلباتي
                  </Link>
                )}
                {user?.role === 'supplier' && (
                  <Link href="/supplier" className="text-primary py-2 font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4"/> لوحة المورد
                  </Link>
                )}
                <button onClick={logout} className="text-destructive py-2 font-semibold flex items-center gap-2 text-right">
                  <LogOut className="w-4 h-4"/> تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
