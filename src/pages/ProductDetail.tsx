import { Layout } from "@/components/Layout";
import { useRoute } from "wouter";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { formatPrice, calculateDiscount, translateDiscountReason } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck, Tag } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { HomeBackLink } from "@/components/HomeBackLink";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_LABELS: Record<string, string> = {
  textiles: "أقمشة",
  clothing: "ملابس",
  abayas: "عبايات",
  dresses: "فساتين",
  clearance: "تصفية",
};

/** Arabic plural for meters: 1 متر, 2 متر, 3 أمتار and above */
function formatMeters(n: number): string {
  if (n <= 2) return `${n} متر`;
  return `${n} أمتار`;
}

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = parseInt(params?.id || "0");

  const { data: product, isLoading } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [snapOption, setSnapOption] = useState<string>("بدون طقطاق");
  const [mainImage, setMainImage] = useState<string | null>(null);
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
  const isTextile = product.category === "textiles" || product.unit === "meter";
  const isAbaya = product.category === "abayas";
  // For textiles: cap at maxQuantityPerOrder (default 12). For others: use stock.
  const maxQty = isTextile
    ? Math.min(product.maxQuantityPerOrder ?? 12, product.quantity || 12)
    : product.quantity;
  const displayImages = product.images && product.images.length > 0 ? product.images : null;
  const activeImage = mainImage ?? product.imageUrl ?? null;

  const handleAddToCart = () => {
    // Enforce size selection for abayas
    if (isAbaya && !selectedSize) {
      toast({ title: "يرجى اختيار المقاس", variant: "destructive" });
      return;
    }

    const options: { selectedSize?: string; snapOption?: string } = {};
    if (selectedSize) options.selectedSize = selectedSize;
    // Always capture snap option for abayas
    if (isAbaya) options.snapOption = snapOption;

    addToCart(product.id, quantity, options);
    toast({
      title: "تم الإضافة للسلة",
      description: isAbaya
        ? `${product.name} — مقاس ${selectedSize} · ${snapOption}`
        : isTextile
        ? `${product.name} — ${formatMeters(quantity)}`
        : "تم إضافة المنتج بنجاح.",
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
                src={activeImage || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&h=1000&fit=crop"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails — shown only if multiple images */}
            {displayImages && displayImages.length > 1 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === img ? "border-primary" : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="text-primary font-semibold text-sm bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                {CATEGORY_LABELS[product.category] ?? product.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-black text-foreground">
                {isTextile
                  ? <>{product.price} <span className="text-xl font-bold">ر.س</span> <span className="text-base font-normal text-muted-foreground">/ متر</span></>
                  : formatPrice(product.price)
                }
              </div>
              {product.originalPrice > product.price && (
                <div className="text-lg text-muted-foreground line-through">
                  {isTextile
                    ? `${product.originalPrice} ر.س / متر`
                    : formatPrice(product.originalPrice)
                  }
                </div>
              )}
            </div>

            {/* Info panel — supplier and discount reason ONLY (no stock shown to public) */}
            <div className="glass-panel rounded-xl p-4 mb-6 flex flex-col gap-3">
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
            </div>

            {/* Size selector — abayas: fixed sizes 52-60; other categories: availableSizes from DB */}
            {isAbaya && (
              <div className="mb-5">
                <h3 className="text-sm font-bold mb-3">
                  اختري المقاس <span className="text-destructive">*</span>
                  <span className="text-muted-foreground font-normal mr-1">(عباية)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["52", "54", "56", "58", "60"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === size ? undefined : size)}
                      className={`w-12 h-12 rounded-xl border-2 text-sm font-bold transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/15 hover:border-white/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isAbaya && product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-bold mb-3">اختر المقاس</h3>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(selectedSize === size ? undefined : size)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/15 hover:border-white/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Snap option — always shown for ALL abayas */}
            {isAbaya && (
              <div className="mb-5">
                <h3 className="text-sm font-bold mb-3">طقطاق العباية</h3>
                <div className="flex gap-2">
                  {["بدون طقطاق", "إضافة طقطاق"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSnapOption(opt)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                        snapOption === opt
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/15 hover:border-white/30"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">الوصف</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center bg-background border border-border rounded-xl h-14 px-2">
                  <button
                    className="w-10 h-10 flex items-center justify-center text-xl text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >-</button>
                  <span className="w-20 text-center font-bold text-lg">
                    {isTextile ? formatMeters(quantity) : quantity}
                  </span>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-xl text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
                    onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                    disabled={quantity >= maxQty}
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
