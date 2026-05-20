import { Layout } from "@/components/Layout";
import { useRoute } from "wouter";
import { useGetProduct, useAddToCart } from "@workspace/api-client-react";
import { formatPrice, calculateDiscount, translateDiscountReason } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, ShieldCheck, Tag, Box, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: product, isLoading } = useGetProduct(id);
  const [quantity, setQuantity] = useState(1);
  const { isAuthenticated, user } = useAuth();
  const isSupplier = user?.role === 'supplier';
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useAddToCart({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/api/cart`] });
        toast({
          title: "تم الإضافة للسلة",
          description: "تم إضافة المنتج بنجاح.",
        });
      }
    }
  });

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
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    if (isSupplier) return;
    addToCartMutation.mutate({ data: { productId: product.id, quantity } });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <button onClick={() => window.history.back()} className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowRight className="w-4 h-4 ml-2" />
          عودة
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-white/5 aspect-square relative">
              {discount > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                  خصم {discount}%
                </div>
              )}
              {/* product full size image placeholder */}
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
                {product.category === 'textiles' ? 'أقمشة' : 'ملابس'}
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
              {isSupplier ? (
                <div className="glass-panel rounded-xl p-4 text-center text-sm text-muted-foreground">
                  حساب المورد مخصص لإدارة المنتجات والطلبات، ولا يمكنه إتمام عمليات الشراء.
                </div>
              ) : (
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
                    isLoading={addToCartMutation.isPending}
                    disabled={product.quantity === 0}
                  >
                    <ShoppingCart className="w-5 h-5 ml-2" />
                    {product.quantity === 0 ? 'نفذت الكمية' : 'إضافة للسلة'}
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
