import { Link } from "wouter";
import { formatPrice, calculateDiscount, translateDiscountReason } from "@/lib/utils";
import { ShoppingCart, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/supabase";

export function ProductCard({ product }: { product: Product }) {
  const discount = calculateDiscount(product.price, product.originalPrice);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
    toast({
      title: "تم الإضافة للسلة",
      description: `${product.name} أضيف بنجاح.`,
    });
  };

  return (
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
                {formatPrice(product.price)}
              </div>
              {product.originalPrice > product.price && (
                <div className="text-sm text-muted-foreground line-through opacity-70">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
            
            <Button 
              size="icon" 
              variant="secondary"
              className="rounded-full w-10 h-10 shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
