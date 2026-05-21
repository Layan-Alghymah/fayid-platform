// ─── Categories Tab ───────────────────────────────────────────────────────────
// Uses mock data — no backend categories management endpoint available yet.
// REAL AUTH SWAP: replace MOCK_CATEGORIES with useListCategories() hook when ready.

import { useState } from "react";
import { Tag, Plus, ToggleLeft, ToggleRight, Star } from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_CATEGORIES = [
  { id: 1, name: "عباءات",     icon: "👘", products: 23, active: true,  featured: true  },
  { id: 2, name: "حجابات",     icon: "🧕", products: 18, active: true,  featured: false },
  { id: 3, name: "فساتين",     icon: "👗", products: 31, active: true,  featured: true  },
  { id: 4, name: "بدلات",      icon: "👔", products: 9,  active: true,  featured: false },
  { id: 5, name: "قمصان",      icon: "👕", products: 14, active: true,  featured: false },
  { id: 6, name: "أقمشة",      icon: "🧵", products: 42, active: true,  featured: true  },
  { id: 7, name: "إكسسوارات", icon: "👜", products: 7,  active: false, featured: false },
];

export function CategoriesTab() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newName, setNewName]       = useState("");
  const [newIcon, setNewIcon]       = useState("");
  const [addMode, setAddMode]       = useState(false);

  const toggleActive = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const toggleFeatured = (id: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    );
  };

  const addCategory = () => {
    const name = newName.trim();
    if (!name) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name, icon: newIcon.trim() || "🏷️", products: 0, active: true, featured: false },
    ]);
    setNewName("");
    setNewIcon("");
    setAddMode(false);
  };

  const activeCount   = categories.filter((c) => c.active).length;
  const featuredCount = categories.filter((c) => c.featured).length;
  const totalProducts = categories.reduce((s, c) => s + c.products, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">التصنيفات</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {categories.length} تصنيف — {totalProducts} منتج إجمالي — بيانات تجريبية
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-sm">
            <div className="glass-panel px-3 py-1.5 rounded-xl text-center border-white/5">
              <span className="font-black text-primary">{activeCount}</span>
              <span className="text-xs text-muted-foreground mr-1">نشط</span>
            </div>
            <div className="glass-panel px-3 py-1.5 rounded-xl text-center border-white/5">
              <span className="font-black text-amber-400">{featuredCount}</span>
              <span className="text-xs text-muted-foreground mr-1">مميز</span>
            </div>
          </div>
          <button
            onClick={() => setAddMode((v) => !v)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-all hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة تصنيف
          </button>
        </div>
      </div>

      {/* Add category form */}
      {addMode && (
        <div className="glass-panel rounded-2xl p-5 border-white/10 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <p className="font-bold text-sm">تصنيف جديد</p>
          <div className="flex gap-3">
            <input
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              placeholder="أيقونة (emoji)"
              className="w-20 bg-background/50 border border-border rounded-xl px-3 h-10 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              placeholder="اسم التصنيف..."
              className="flex-1 bg-background/50 border border-border rounded-xl px-4 h-10 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={addCategory}
              className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
            >
              إضافة
            </button>
            <button
              onClick={() => setAddMode(false)}
              className="px-3 h-10 rounded-xl bg-white/5 text-muted-foreground text-xs font-bold hover:bg-white/10"
            >
              إلغاء
            </button>
          </div>
          <p className="text-xs text-muted-foreground/60">
            * التغييرات محلية فقط — سيتم ربطها بـ API التصنيفات عند توفّره
          </p>
        </div>
      )}

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className={`glass-panel rounded-2xl p-5 border transition-all ${
              c.active ? "border-white/10" : "border-white/5 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none">{c.icon}</span>
                <div>
                  <p className={`font-bold ${c.active ? "text-foreground" : "text-muted-foreground"}`}>
                    {c.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {c.products} منتج
                  </p>
                </div>
              </div>

              {/* Featured badge */}
              {c.featured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  <Star className="w-2.5 h-2.5" /> مميز
                </span>
              )}
            </div>

            {/* Toggle controls */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => toggleActive(c.id)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                title={c.active ? "إخفاء" : "إظهار"}
              >
                {c.active
                  ? <ToggleRight className="w-5 h-5 text-green-400" />
                  : <ToggleLeft className="w-5 h-5" />}
                {c.active ? "نشط" : "موقوف"}
              </button>
              <button
                onClick={() => toggleFeatured(c.id)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  c.featured ? "text-amber-400 hover:text-amber-300" : "text-muted-foreground hover:text-amber-400"
                }`}
                title={c.featured ? "إلغاء التمييز" : "تمييز"}
              >
                <Star className="w-3.5 h-3.5" />
                {c.featured ? "ممّيز" : "تمييز"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/50 text-center">
        * بيانات تجريبية — التغييرات لا تُحفظ على الخادم حتى تتوفر نقطة API
      </p>
    </div>
  );
}
