import { useEffect, useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { adminSupabase, type Supplier, type SupabaseProduct } from "@/lib/supabase";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronRight,
  Package,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ImageIcon,
  AlertCircle,
  Pencil,
  Store,
} from "lucide-react";

const SUPPLIER_TYPES = [
  { value: "manufacturer", label: "مصنع" },
  { value: "wholesaler", label: "تاجر جملة" },
  { value: "boutique", label: "بوتيك" },
  { value: "other", label: "أخرى" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "clothing", label: "ملابس" },
  { value: "textiles", label: "أقمشة" },
  { value: "abayas", label: "عبايات" },
  { value: "dresses", label: "فساتين" },
  { value: "clearance", label: "تصفية" },
];

const CATEGORY_LABELS: Record<string, string> = {
  clothing: "ملابس",
  textiles: "أقمشة",
  abayas: "عبايات",
  dresses: "فساتين",
  clearance: "تصفية",
};

const ABAYA_SIZES = ["52", "54", "56", "58", "60"];

const defaultProductForm = {
  name: "",
  description: "",
  category: "clothing",
  price: "",
  original_price: "",
  quantity: "",
  discount_reason: "",
  sizes: "",
  brand: "",
  is_active: true,
  available_sizes: [] as string[],
  has_abaya_snap_option: false,
  max_quantity_per_order: "12",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminSupplierDetail() {
  const { toast } = useToast();
  const [, params] = useRoute("/admin/suppliers/:id");
  const supplierId = parseInt(params?.id ?? "0");

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loadingSupplier, setLoadingSupplier] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Supplier edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", city: "", whatsapp: "", email: "", type: "", is_active: true });
  const [editSaving, setEditSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editQty, setEditQty] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // ─── Load data ─────────────────────────────────────────────────────────────

  async function loadSupplier() {
    setLoadingSupplier(true);
    const { data, error } = await adminSupabase
      .from("suppliers")
      .select("*")
      .eq("id", supplierId)
      .single();
    if (error && error.code !== "PGRST116") {
      console.error("[admin] loadSupplier error:", error.message);
    }
    setSupplier(data ?? null);
    setLoadingSupplier(false);
  }

  async function loadProducts() {
    setLoadingProducts(true);
    const { data, error } = await adminSupabase
      .from("products")
      .select("*")
      .eq("supplier_id", supplierId)
      .order("id", { ascending: false });
    if (error) console.error("[admin] loadProducts error:", error.message);
    setProducts(data ?? []);
    setLoadingProducts(false);
  }

  useEffect(() => {
    if (supplierId) {
      loadSupplier();
      loadProducts();
    }
  }, [supplierId]);

  // ─── Edit supplier ─────────────────────────────────────────────────────────

  const openEditModal = () => {
    if (!supplier) return;
    setEditForm({
      name: supplier.name ?? "",
      city: supplier.city ?? "",
      whatsapp: supplier.whatsapp ?? "",
      email: supplier.email ?? "",
      type: supplier.type ?? "wholesaler",
      is_active: supplier.is_active ?? true,
    });
    setLogoPreview(supplier.logo_url ?? null);
    setLogoFile(null);
    setShowEditModal(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;
    setEditSaving(true);

    let logoUrl: string | null | undefined = undefined; // undefined = don't update

    if (logoFile) {
      const safeName = logoFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `logos/${Date.now()}-${safeName}`;
      const { data: uploadData, error: uploadError } = await adminSupabase.storage
        .from("image_url")
        .upload(path, logoFile, { upsert: false });
      if (uploadError) {
        toast({ title: "خطأ", description: `فشل رفع الشعار: ${uploadError.message}`, variant: "destructive" });
        setEditSaving(false);
        return;
      }
      const { data: urlData } = adminSupabase.storage.from("image_url").getPublicUrl(uploadData.path);
      logoUrl = urlData.publicUrl;
    }

    const updatePayload: Record<string, any> = {
      name: editForm.name.trim(),
      city: editForm.city.trim() || null,
      whatsapp: editForm.whatsapp.trim() || null,
      email: editForm.email.trim() || null,
      type: editForm.type || null,
      is_active: editForm.is_active,
    };
    if (logoUrl !== undefined) updatePayload.logo_url = logoUrl;

    const { error } = await adminSupabase
      .from("suppliers")
      .update(updatePayload)
      .eq("id", supplierId);

    if (error) {
      toast({ title: "خطأ", description: `فشل الحفظ: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "تم الحفظ", description: "تم تحديث بيانات المورد بنجاح" });
      setShowEditModal(false);
      await loadSupplier();
    }
    setEditSaving(false);
  };

  // ─── Image handling ────────────────────────────────────────────────────────

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // ─── Add product ───────────────────────────────────────────────────────────

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!productForm.name.trim()) { setFormError("اسم المنتج مطلوب"); return; }
    if (!productForm.price || isNaN(Number(productForm.price))) { setFormError("السعر مطلوب ويجب أن يكون رقماً"); return; }
    if (!productForm.quantity || isNaN(Number(productForm.quantity))) { setFormError("الكمية مطلوبة ويجب أن تكون رقماً"); return; }
    if (!supplier) { setFormError("بيانات المورد غير محملة"); return; }

    setSaving(true);

    // Upload all images
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
      const { data: uploadData, error: uploadError } = await adminSupabase.storage
        .from("image_url")
        .upload(path, file, { upsert: false });
      if (uploadError) {
        setFormError(`فشل رفع الصورة: ${uploadError.message}`);
        setSaving(false);
        return;
      }
      const { data: urlData } = adminSupabase.storage.from("image_url").getPublicUrl(uploadData.path);
      imageUrls.push(urlData.publicUrl);
    }

    // Sizes for clothing/dresses
    const sizesArray =
      productForm.sizes.trim()
        ? productForm.sizes.split(",").map((s) => s.trim()).filter(Boolean)
        : null;

    // Build insert payload
    const insertPayload: Record<string, any> = {
      supplier_id: supplierId,
      supplier_name: supplier.name,
      name: productForm.name.trim(),
      description: productForm.description.trim() || null,
      category: productForm.category,
      price: Number(productForm.price),
      original_price: productForm.original_price
        ? Number(productForm.original_price)
        : Number(productForm.price),
      quantity: Number(productForm.quantity),
      image_url: imageUrls[0] ?? null,
      discount_reason: productForm.discount_reason.trim() || null,
      sizes: sizesArray,
      brand: productForm.brand.trim() || null,
      is_active: productForm.is_active,
    };

    // Multi-image
    if (imageUrls.length > 1) insertPayload.images = imageUrls;

    // Category-specific fields
    if (productForm.category === "abayas") {
      if (productForm.available_sizes.length > 0) insertPayload.available_sizes = productForm.available_sizes;
      insertPayload.has_abaya_snap_option = productForm.has_abaya_snap_option;
    }
    if (productForm.category === "textiles") {
      insertPayload.unit = "meter";
      insertPayload.max_quantity_per_order = Number(productForm.max_quantity_per_order) || 12;
    }

    const { error: insertError } = await adminSupabase.from("products").insert(insertPayload);

    if (insertError) {
      setFormError(`فشل إضافة المنتج: ${insertError.message}`);
      setSaving(false);
      return;
    }

    setFormSuccess("تم إضافة المنتج بنجاح");
    setProductForm(defaultProductForm);
    setImageFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSaving(false);
    await loadProducts();
    setTimeout(() => setFormSuccess(""), 3000);
  };

  // ─── Quick edit save ───────────────────────────────────────────────────────

  const saveQuickEdit = async (productId: number) => {
    setUpdatingId(productId);
    await adminSupabase
      .from("products")
      .update({ price: Number(editPrice), quantity: Number(editQty) })
      .eq("id", productId);
    setEditingId(null);
    setUpdatingId(null);
    await loadProducts();
  };

  // ─── Toggle active ─────────────────────────────────────────────────────────

  const toggleActive = async (productId: number, currentActive: boolean) => {
    setUpdatingId(productId);
    await adminSupabase.from("products").update({ is_active: !currentActive }).eq("id", productId);
    setUpdatingId(null);
    await loadProducts();
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loadingSupplier) {
    return (
      <AdminPasswordGate>
        <div dir="rtl" className="min-h-screen bg-background">
          <AdminNav />
          <main className="max-w-6xl mx-auto px-4 py-10">
            <div className="h-24 bg-card rounded-2xl animate-pulse mb-6" />
            <div className="h-64 bg-card rounded-2xl animate-pulse" />
          </main>
        </div>
      </AdminPasswordGate>
    );
  }

  if (!supplier) {
    return (
      <AdminPasswordGate>
        <div dir="rtl" className="min-h-screen bg-background">
          <AdminNav />
          <main className="max-w-6xl mx-auto px-4 py-20 text-center">
            <p className="text-xl font-bold text-muted-foreground">المورد غير موجود</p>
            <Link href="/admin/suppliers">
              <Button className="mt-4">العودة للموردين</Button>
            </Link>
          </main>
        </div>
      </AdminPasswordGate>
    );
  }

  return (
    <AdminPasswordGate>
      <div dir="rtl" className="min-h-screen bg-background">
        <AdminNav />
        <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/admin/suppliers" className="hover:text-foreground">الموردون</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{supplier.name}</span>
          </div>

          {/* ── Section 1: Supplier Info ── */}
          <section className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {supplier.logo_url ? (
                  <img
                    src={supplier.logo_url}
                    alt={supplier.name}
                    className="w-14 h-14 rounded-full object-cover border border-border flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Store className="w-7 h-7 text-primary" />
                  </div>
                )}
                <h2 className="text-xl font-bold">بيانات المورد</h2>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={openEditModal}>
                <Pencil className="w-3.5 h-3.5" />
                تعديل معلومات المورد
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <InfoRow label="الاسم" value={supplier.name} />
              <InfoRow label="البريد" value={supplier.email ?? "—"} />
              <InfoRow label="واتساب" value={supplier.whatsapp ?? "—"} />
              <InfoRow label="المدينة" value={supplier.city ?? "—"} />
              <InfoRow label="النوع" value={supplier.type ?? "—"} />
              <InfoRow label="الحالة" value={supplier.is_active ? "نشط" : "غير نشط"} />
            </div>
          </section>

          {/* ── Section 2: Add Product ── */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">إضافة منتج</h2>
              <Button
                size="sm"
                onClick={() => { setShowProductForm((v) => !v); setFormError(""); setFormSuccess(""); }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {showProductForm ? "إخفاء النموذج" : "إضافة منتج جديد"}
              </Button>
            </div>

            {showProductForm && (
              <div className="glass-panel rounded-2xl p-6">
                <form onSubmit={handleAddProduct} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Name */}
                    <FormField label="اسم المنتج" required className="sm:col-span-2">
                      <Input
                        value={productForm.name}
                        onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="فستان كاجوال نسائي"
                      />
                    </FormField>

                    {/* Description */}
                    <FormField label="الوصف" className="sm:col-span-2">
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="وصف المنتج..."
                        rows={2}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                      />
                    </FormField>

                    {/* Category */}
                    <FormField label="الفئة" required>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm((f) => ({ ...f, category: e.target.value, available_sizes: [], has_abaya_snap_option: false }))}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-primary"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </FormField>

                    {/* Brand */}
                    <FormField label="الماركة / العلامة التجارية">
                      <Input
                        value={productForm.brand}
                        onChange={(e) => setProductForm((f) => ({ ...f, brand: e.target.value }))}
                        placeholder="اختياري"
                      />
                    </FormField>

                    {/* Price */}
                    <FormField label="السعر (ر.س)" required>
                      <Input
                        type="number" min="0" step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                        placeholder="150" dir="ltr" className="text-right"
                      />
                    </FormField>

                    {/* Original price */}
                    <FormField label="السعر الأصلي (ر.س)">
                      <Input
                        type="number" min="0" step="0.01"
                        value={productForm.original_price}
                        onChange={(e) => setProductForm((f) => ({ ...f, original_price: e.target.value }))}
                        placeholder="200" dir="ltr" className="text-right"
                      />
                    </FormField>

                    {/* Quantity */}
                    <FormField label={productForm.category === "textiles" ? "الكمية المتاحة (متر)" : "الكمية المتاحة"} required>
                      <Input
                        type="number" min="0"
                        value={productForm.quantity}
                        onChange={(e) => setProductForm((f) => ({ ...f, quantity: e.target.value }))}
                        placeholder={productForm.category === "textiles" ? "100" : "50"}
                        dir="ltr" className="text-right"
                      />
                    </FormField>

                    {/* Textiles: max_quantity_per_order */}
                    {productForm.category === "textiles" && (
                      <FormField label="أقصى كمية للطلب (متر)">
                        <Input
                          type="number" min="1"
                          value={productForm.max_quantity_per_order}
                          onChange={(e) => setProductForm((f) => ({ ...f, max_quantity_per_order: e.target.value }))}
                          placeholder="12" dir="ltr" className="text-right"
                        />
                      </FormField>
                    )}

                    {/* Clothing/Dresses: sizes text input */}
                    {(productForm.category === "clothing" || productForm.category === "dresses") && (
                      <FormField label="المقاسات (مفصولة بفاصلة)">
                        <Input
                          value={productForm.sizes}
                          onChange={(e) => setProductForm((f) => ({ ...f, sizes: e.target.value }))}
                          placeholder="S, M, L, XL"
                          dir="ltr" className="text-right"
                        />
                      </FormField>
                    )}

                    {/* Abayas: checkboxes for sizes 52-60 + snap option */}
                    {productForm.category === "abayas" && (
                      <>
                        <FormField label="المقاسات المتاحة (عبايات)" className="sm:col-span-2">
                          <div className="flex flex-wrap gap-3 mt-1">
                            {ABAYA_SIZES.map((size) => (
                              <label key={size} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={productForm.available_sizes.includes(size)}
                                  onChange={(e) => {
                                    setProductForm((f) => ({
                                      ...f,
                                      available_sizes: e.target.checked
                                        ? [...f.available_sizes, size]
                                        : f.available_sizes.filter((s) => s !== size),
                                    }));
                                  }}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">{size}</span>
                              </label>
                            ))}
                          </div>
                        </FormField>
                        <FormField label="خيار طقطاق العباية" className="sm:col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer h-11">
                            <input
                              type="checkbox"
                              checked={productForm.has_abaya_snap_option}
                              onChange={(e) => setProductForm((f) => ({ ...f, has_abaya_snap_option: e.target.checked }))}
                              className="w-5 h-5"
                            />
                            <span className="text-sm">إتاحة خيار إضافة الطقطاق للمشتري</span>
                          </label>
                        </FormField>
                      </>
                    )}

                    {/* Discount reason */}
                    <FormField label="سبب الخصم" className="sm:col-span-2">
                      <Input
                        value={productForm.discount_reason}
                        onChange={(e) => setProductForm((f) => ({ ...f, discount_reason: e.target.value }))}
                        placeholder="تصفية موسمية، عينة..."
                      />
                    </FormField>

                    {/* Image upload — multiple */}
                    <FormField label="صور المنتج" className="sm:col-span-2">
                      <div className="space-y-3">
                        {imagePreviews.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {imagePreviews.map((src, idx) => (
                              <div key={idx} className="relative">
                                <img
                                  src={src}
                                  alt={`صورة ${idx + 1}`}
                                  className="w-20 h-20 rounded-xl object-cover border border-border"
                                />
                                {idx === 0 && (
                                  <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground text-[10px] px-1 rounded-tl-lg font-bold">
                                    رئيسية
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {imagePreviews.length === 0 && (
                          <div className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center bg-background/50">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="block w-full text-sm text-muted-foreground file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20 cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP — يمكن اختيار عدة صور. الصورة الأولى ستكون الرئيسية.
                        </p>
                      </div>
                    </FormField>

                    {/* is_active */}
                    <FormField label="الحالة" className="sm:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={productForm.is_active}
                          onChange={(e) => setProductForm((f) => ({ ...f, is_active: e.target.checked }))}
                          className="w-5 h-5 rounded"
                        />
                        <span className="text-sm">منتج نشط (مرئي للمشترين)</span>
                      </label>
                    </FormField>
                  </div>

                  {/* Supplier note */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    سيتم ربط المنتج تلقائياً بالمورد:{" "}
                    <span className="font-bold text-primary">{supplier.name}</span>
                  </div>

                  {formError && <p className="text-destructive text-sm">{formError}</p>}
                  {formSuccess && <p className="text-green-500 text-sm">{formSuccess}</p>}

                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="min-w-32">
                      {saving ? "جاري الحفظ..." : "إضافة المنتج"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowProductForm(false)}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </section>

          {/* ── Section 3: Products List ── */}
          <section>
            <h2 className="text-xl font-bold mb-4">
              منتجات {supplier.name}
              {!loadingProducts && (
                <span className="text-muted-foreground text-base font-normal mr-2">
                  ({products.length})
                </span>
              )}
            </h2>

            {loadingProducts ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 glass-panel rounded-2xl">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="font-bold">لا توجد منتجات لهذا المورد</p>
                <p className="text-sm text-muted-foreground mt-1">أضف أول منتج باستخدام النموذج أعلاه</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-background/50 flex-shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-muted-foreground opacity-40" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{p.name}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {CATEGORY_LABELS[p.category] ?? p.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.price} ر.س
                          {p.original_price > p.price && (
                            <span className="line-through mr-1 opacity-50">{p.original_price}</span>
                          )}
                        </span>
                        <span className={`text-xs ${p.quantity < 10 ? "text-amber-400" : "text-muted-foreground"}`}>
                          مخزون: {p.quantity}{(p as any).unit === "meter" ? " متر" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Quick edit / actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {editingId === p.id ? (
                        <>
                          <Input
                            type="number" value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 h-8 text-sm" placeholder="سعر" dir="ltr"
                          />
                          <Input
                            type="number" value={editQty}
                            onChange={(e) => setEditQty(e.target.value)}
                            className="w-20 h-8 text-sm" placeholder="كمية" dir="ltr"
                          />
                          <Button size="sm" className="h-8 text-xs" disabled={updatingId === p.id} onClick={() => saveQuickEdit(p.id)}>
                            {updatingId === p.id ? "..." : "حفظ"}
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={() => setEditingId(null)}>
                            إلغاء
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm" variant="outline" className="h-8 text-xs"
                          onClick={() => { setEditingId(p.id); setEditPrice(String(p.price)); setEditQty(String(p.quantity)); }}
                        >
                          تعديل السعر / الكمية
                        </Button>
                      )}

                      {/* Toggle active */}
                      <Button
                        size="sm"
                        variant={p.is_active ? "outline" : "ghost"}
                        className="h-8 text-xs gap-1"
                        disabled={updatingId === p.id}
                        onClick={() => toggleActive(p.id, p.is_active)}
                        title={p.is_active ? "إخفاء المنتج" : "إظهار المنتج"}
                      >
                        {p.is_active ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-green-500" />
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Section 4: Orders placeholder ── */}
          <section className="glass-panel rounded-2xl p-6 opacity-60">
            <h2 className="text-xl font-bold mb-2">طلبات هذا المورد</h2>
            <p className="text-muted-foreground text-sm">قريبًا</p>
          </section>
        </main>

        {/* ── Edit Supplier Modal ── */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="glass-panel rounded-2xl p-6 max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold">تعديل معلومات المورد</h3>
              <form onSubmit={handleEditSave} className="space-y-4">
                {/* Logo upload */}
                <div>
                  <label className="block text-sm font-bold mb-1.5">شعار المورد</label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <img src={logoPreview} alt="شعار" className="w-16 h-16 rounded-full object-cover border border-border flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-full border border-dashed border-border flex items-center justify-center flex-shrink-0 bg-background/50">
                        <Store className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="block text-sm text-muted-foreground file:ml-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:text-xs hover:file:bg-primary/20 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5">الاسم <span className="text-destructive">*</span></label>
                  <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} placeholder="اسم المورد" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">المدينة</label>
                  <Input value={editForm.city} onChange={(e) => setEditForm((f) => ({ ...f, city: e.target.value }))} placeholder="الرياض" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">واتساب</label>
                  <Input value={editForm.whatsapp} onChange={(e) => setEditForm((f) => ({ ...f, whatsapp: e.target.value }))} placeholder="966501234567" dir="ltr" className="text-right" inputMode="tel" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">البريد الإلكتروني</label>
                  <Input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} placeholder="supplier@example.com" dir="ltr" className="text-right" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5">النوع</label>
                  <select value={editForm.type} onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))} className="w-full bg-background/50 border border-border rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-primary">
                    {SUPPLIER_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={editForm.is_active} onChange={(e) => setEditForm((f) => ({ ...f, is_active: e.target.checked }))} className="w-5 h-5 rounded" />
                    <span className="text-sm font-bold">مورد نشط</span>
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={editSaving} className="flex-1">
                    {editSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
                  </Button>
                  <Button type="button" variant="ghost" className="flex-1" disabled={editSaving} onClick={() => setShowEditModal(false)}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPasswordGate>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}

function FormField({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-bold mb-1.5">
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
      </label>
      {children}
    </div>
  );
}
