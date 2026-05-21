import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { cart } = useCart();

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
            <ThemeToggle />
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
            <Link href="/cart" className="text-base font-bold text-foreground py-2 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4"/> السلة
              {cartItemsCount > 0 && (
                <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
