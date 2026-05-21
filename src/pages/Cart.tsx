import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
    toast({ title: "تم الحذف", description: "تم إزالة المنتج من السلة" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
          <div className="w-full h-96 bg-card animate-pulse rounded-3xl"></div>
        </div>
      </Layout>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">سلة المشتريات</h1>

        {isEmpty ? (
          <div className="text-center py-24 glass-panel rounded-3xl">
            <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-40" />
            <h2 className="text-2xl font-bold text-foreground mb-4">سلتك فارغة!</h2>
            <p className="text-muted-foreground mb-8">لم تقم بإضافة أي منتجات للسلة بعد.</p>
            <Link href="/products">
              <Button size="lg">تصفح المنتجات الآن</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3 space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-6 items-center relative pr-12 sm:pr-4">
                  
                  <button 
                    className="absolute top-4 right-4 sm:static sm:order-last p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    onClick={() => handleRemove(item.productId)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-background flex-shrink-0">
                    <img
                      src={item.product?.imageUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&h=200&fit=crop"}
                      alt={item.product?.name ?? "منتج"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row items-center justify-between w-full">
                    <div className="text-center sm:text-right mb-4 sm:mb-0">
                      <Link href={`/products/${item.product?.id ?? item.productId}`}>
                        <h3 className="font-bold text-lg hover:text-primary transition-colors">{item.product?.name ?? "منتج"}</h3>
                      </Link>
                      <p className="text-primary font-bold mt-1">{formatPrice(item.product?.price ?? 0)}</p>
                    </div>

                    <div className="flex items-center bg-background border border-white/10 rounded-lg h-10 px-1">
                      <button 
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                        onClick={() => updateCartItem(item.productId, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                        onClick={() => updateCartItem(item.productId, Math.min(item.product?.quantity ?? 999, item.quantity + 1))}
                        disabled={item.quantity >= (item.product?.quantity ?? 999)}
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="glass-panel p-6 rounded-3xl sticky top-28">
                <h3 className="text-xl font-bold mb-6">ملخص الطلب</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>رسوم المنصة (10%)</span>
                    <span>{formatPrice(cart.total * 0.1)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-xl text-foreground">
                    <span>الإجمالي</span>
                    <span className="text-primary">{formatPrice(cart.total * 1.1)}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="w-full shadow-lg shadow-primary/20 text-lg h-14"
                  onClick={() => setLocation("/checkout")}
                >
                  إتمام الطلب
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
