import { Layout } from "@/components/Layout";
import { useRoute } from "wouter";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calculateDiscount, translateDiscountReason } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, Tag, Box } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { HomeBackLink } from "@/components/HomeBackLink";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: product, isLoading } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
          <div className="animate-pulse flex flex-col md:flex-row gap-8 w-full">
            <div className="w-full md:w-1/2 bg-card h-[500px] rounded-3xl"></div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="h-8 bg-card rounded w-3/4"></div>
              <div className="h-6 bg-card rounded w-1/4"></div>
              <div className="h-32 bg-card rounded w-full"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-32">
          <h1 className="text-2xl font-bold">المنتج غير موجود</h1>
          <Button onClick={() => setLocation("/products")} className="mt-4">العودة للمنتجات</Button>
        </div>
      </Layout>
    );
  }

  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    toast({
      title: "تم الإضافة للسلة",
      description: "تم إضافة المنتج بنجاح.",
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-8" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-primary transition-colors font-medium">
            الرئيسية
          </Link>
          <span className="opacity-50">/</span>
          <Link href="/products" className="hover:text-primary transition-colors font-medium">
            المنتجات
          </Link>
          <span className="opacity-50">/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>
        <div className="mb-6 md:hidden">
          <HomeBackLink />
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/5 aspect-square relative">
              {discount > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                  خصم {discount}%
                </div>
              )}
              <img 
                src={product.imageUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&h=1000&fit=crop"} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="text-primary font-semibold text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {product.category === 'textiles' ? 'أقمشة' : product.category === 'clothing' ? 'ملابس' : product.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-black text-foreground">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>

            <div className="glass-panel rounded-xl p-4 mb-8 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-foreground">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>المورد: <strong className="text-primary">{product.supplierName || 'معتمد'}</strong></span>
              </div>
              {product.discountReason && (
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Tag className="w-5 h-5 text-primary" />
                  <span>سبب الخصم: <strong>{translateDiscountReason(product.discountReason)}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-foreground">
                <Box className="w-5 h-5 text-primary" />
                <span>الكمية المتاحة: <strong>{product.quantity}</strong></span>
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2">الوصف</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-8 border-t border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center bg-background border border-border rounded-xl h-14 px-2">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-xl text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >-</button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-xl text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  >+</button>
                </div>

                <Button
                  size="lg"
                  className="flex-1 h-14 text-lg shadow-xl shadow-primary/20"
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0}
                >
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  {product.quantity === 0 ? 'نفذت الكمية' : 'إضافة للسلة'}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
