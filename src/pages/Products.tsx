import { Layout } from "@/components/Layout";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function Products() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get('category') || '';

  const [filters, setFilters] = useState({
    search: '',
    category: initialCategory,
    minPrice: '',
    maxPrice: '',
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data, isLoading } = useProducts({
    search: filters.search || undefined,
    category: filters.category || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  });

  const categories = [
    { id: '', name: 'الكل' },
    { id: 'عباءات', name: 'عباءات' },
    { id: 'حجابات', name: 'حجابات' },
    { id: 'فساتين', name: 'فساتين' },
    { id: 'بدلات', name: 'بدلات' },
    { id: 'قمصان', name: 'قمصان' },
    { id: 'أقمشة', name: 'أقمشة' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">المنتجات</h1>
          <Button variant="outline" onClick={() => setIsSidebarOpen(true)}>
            <SlidersHorizontal className="w-4 h-4 ml-2" />
            الفلاتر
          </Button>
        </div>

        {/* Sidebar Filters */}
        <div className={`
          fixed inset-y-0 right-0 z-50 w-80 bg-card border-l border-white/10 p-6 transform transition-transform duration-300 ease-in-out md:relative md:w-64 md:translate-x-0 md:bg-transparent md:border-0 md:p-0 md:z-auto
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex items-center justify-between md:hidden mb-6">
            <h2 className="font-bold text-lg">الفلاتر</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-8 sticky top-28">
            {/* Search */}
            <div>
              <h3 className="font-bold text-foreground mb-4">بحث</h3>
              <Input 
                placeholder="ابحث هنا..." 
                icon={<Search className="w-4 h-4" />}
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-bold text-foreground mb-4">القسم</h3>
              <div className="flex flex-col gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters(f => ({ ...f, category: cat.id }))}
                    className={`text-right px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      filters.category === cat.id 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-bold text-foreground mb-4">السعر</h3>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  placeholder="من" 
                  value={filters.minPrice}
                  onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                />
                <span className="text-muted-foreground">-</span>
                <Input 
                  type="number" 
                  placeholder="إلى" 
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                />
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setFilters({ search: '', category: '', minPrice: '', maxPrice: '' })}
            >
              مسح الفلاتر
            </Button>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Products Grid */}
        <div className="flex-1">
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-bold text-foreground">جميع المنتجات</h1>
            <p className="text-muted-foreground mt-2">
              {data ? `تم العثور على ${data.total} منتج` : 'جاري التحميل...'}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-card rounded-2xl h-[400px] animate-pulse" />
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass-panel rounded-3xl">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <h3 className="text-2xl font-bold text-foreground">لا توجد نتائج</h3>
              <p className="text-muted-foreground mt-2">جرب تغيير الفلاتر أو كلمات البحث.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
