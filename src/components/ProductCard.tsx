import { useState } from "react";
import { Link } from "wouter";
import { formatPrice, calculateDiscount, translateDiscountReason } from "@/lib/utils";
import { ShoppingCart, Tag, Minus, Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/supabase";

const ABAYA_SIZES = ["52", "54", "56", "58", "60"];
const SNAP_OPTIONS = ["بدون طقطاق", "إضافة طقطاق"];

export function ProductCard({ product }: { product: Product }) {
  const discount = calculateDiscount(product.price, product.originalPrice);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const isTextile = product.category === "textiles";
  const isAbaya = product.category === "abayas";
  const needsModal = isTextile || isAbaya;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [meterQty, setMeterQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [snapOption, setSnapOption] = useState("بدون طقطاق");

  const maxMeters = product.maxQuantityPerOrder ?? 12;
  const abayaSizes =
    product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes
      : ABAYA_SIZES;

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMeterQty(1);
    setSelectedSize("");
    setSnapOption("بدون طقطاق");
    setModalOpen(true);
  };

  const handleDirectAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast({ title: "تم الإضافة للسلة", description: `${product.name} أضيف بنجاح.` });
  };

  const handleModalConfirm = () => {
    if (isAbaya && !selectedSize) {
      toast({ title: "يرجى اختيار المقاس", variant: "destructive" });
      return;
    }
    if (isTextile) {
      addToCart(product.id, meterQty);
      toast({ title: "تم الإضافة للسلة", description: `${product.name} — ${meterQty} متر` });
    } else {
      addToCart(product.id, 1, { selectedSize, snapOption });
      toast({
        title: "تم الإضافة للسلة",
        description: `${product.name} — مقاس ${selectedSize}${snapOption !== "بدون طقطاق" ? " · " + snapOption : ""}`,
      });
    }
    setModalOpen(false);
  };

  return (
    <>
      <Link href={`/products/${product.id}`} className="group block">
        <div className="bg-card rounded-2xl border border-white/5 overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1 h-full flex flex-col">

          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted/30">
            <img
              src={product.imageUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=800&fit=crop"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              {discount > 0 && (
                <div className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 backdrop-blur-md bg-destructive/90">
                  <span>خصم {discount}%</span>
                </div>
              )}
              {product.discountReason && (
                <div className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{translateDiscountReason(product.discountReason)}</span>
                </div>
              )}
            </div>

            {/* Supplier Badge */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-black/60 backdrop-blur-md text-white/90 text-xs px-2 py-1 rounded-md border border-white/10">
                {product.supplierName || 'مورد معتمد'}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            <p className="text-muted-foreground text-xs font-medium mb-1 truncate">{product.category}</p>
            <h3 className="text-foreground font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="mt-auto pt-4 flex items-end justify-between">
              <div>
                <div className="text-xl font-black text-foreground">
                  {isTextile
                    ? `${product.price} ر.س / متر`
                    : formatPrice(product.price)}
                </div>
                {product.originalPrice > product.price && (
                  <div className="text-sm text-muted-foreground line-through opacity-70">
                    {isTextile
                      ? `${product.originalPrice} ر.س / متر`
                      : formatPrice(product.originalPrice)}
                  </div>
                )}
              </div>

              <Button
                size="icon"
                variant="secondary"
                className="rounded-full w-10 h-10 shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                onClick={needsModal ? openModal : handleDirectAdd}
              >
                <ShoppingCart className="w-5 h-5 text-primary" />
              </Button>
            </div>
          </div>
        </div>
      </Link>

      {/* Options Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div dir="rtl" className="bg-card rounded-2xl p-6 max-w-sm w-full space-y-5 shadow-2xl border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Textile: meter quantity */}
            {isTextile && (
              <div className="space-y-3">
                <p className="text-sm font-bold">الكمية (متر)</p>
                <div className="flex items-center gap-4">
                  <button
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40"
                    onClick={() => setMeterQty((q) => Math.max(1, q - 1))}
                    disabled={meterQty <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-black w-12 text-center">{meterQty}</span>
                  <button
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40"
                    onClick={() => setMeterQty((q) => Math.min(maxMeters, q + 1))}
                    disabled={meterQty >= maxMeters}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-muted-foreground">متر</span>
                </div>
                <div className="text-sm font-bold text-primary">
                  الإجمالي: {product.price * meterQty} ر.س
                </div>
              </div>
            )}

            {/* Abaya: size + snap */}
            {isAbaya && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold">المقاس <span className="text-destructive">*</span></p>
                  <div className="flex flex-wrap gap-2">
                    {abayaSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-10 rounded-xl border-2 text-sm font-bold transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold">خيار الطقطاق</p>
                  <div className="flex flex-col gap-2">
                    {SNAP_OPTIONS.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            snapOption === opt ? "border-primary" : "border-muted-foreground"
                          }`}
                        >
                          {snapOption === opt && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                        </div>
                        <input
                          type="radio"
                          className="sr-only"
                          checked={snapOption === opt}
                          onChange={() => setSnapOption(opt)}
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={handleModalConfirm}>
                <ShoppingCart className="w-4 h-4 ml-2" />
                إضافة للسلة
              </Button>
              <Button variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
