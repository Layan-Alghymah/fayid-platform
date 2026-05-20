import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, suppliersTable, ordersTable, orderItemsTable, discountCodesTable } from "@workspace/db";
import { eq, inArray, desc } from "drizzle-orm";
import { requireAuth, requireRole } from "../middleware/requireAuth";
import { CreateProductBody, UpdateProductParams, UpdateProductBody, DeleteProductParams } from "@workspace/api-zod";
import { z } from "zod";

const router: IRouter = Router();

async function getSupplierForUser(userId: number) {
  const [supplier] = await db
    .select()
    .from(suppliersTable)
    .where(eq(suppliersTable.userId, userId));
  return supplier;
}

router.get("/supplier/products", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) {
    res.status(404).json({ error: "Supplier profile not found" });
    return;
  }

  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.supplierId, supplier.id))
    .orderBy(productsTable.createdAt);

  res.json(products.map((p) => ({
    ...p,
    supplierName: supplier.businessName,
    sizes: p.sizes ?? [],
    createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
  })));
});

router.post("/supplier/products", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) {
    res.status(404).json({ error: "Supplier profile not found" });
    return;
  }

  if (supplier.verificationStatus !== "approved") {
    res.status(403).json({ error: "Supplier not yet approved" });
    return;
  }

  const [product] = await db.insert(productsTable).values({
    supplierId: supplier.id,
    name: parsed.data.name,
    category: parsed.data.category,
    description: parsed.data.description ?? null,
    price: parsed.data.price,
    originalPrice: parsed.data.originalPrice,
    quantity: parsed.data.quantity,
    imageUrl: parsed.data.imageUrl ?? null,
    discountReason: parsed.data.discountReason ?? null,
    sizes: parsed.data.sizes ?? [],
    brand: parsed.data.brand ?? null,
    isActive: true,
  }).returning();

  res.status(201).json({
    ...product,
    supplierName: supplier.businessName,
    sizes: product.sizes ?? [],
    createdAt: product.createdAt?.toISOString() ?? new Date().toISOString(),
  });
});

router.patch("/supplier/products/:id", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const paramsParsed = UpdateProductParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: paramsParsed.error.message });
    return;
  }

  const bodyParsed = UpdateProductBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) {
    res.status(404).json({ error: "Supplier not found" });
    return;
  }

  const [existing] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, paramsParsed.data.id));

  if (!existing || existing.supplierId !== supplier.id) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const data = bodyParsed.data;
  const [updated] = await db
    .update(productsTable)
    .set({
      name: data.name,
      category: data.category,
      description: data.description ?? null,
      price: data.price,
      originalPrice: data.originalPrice,
      quantity: data.quantity,
      imageUrl: data.imageUrl ?? null,
      discountReason: data.discountReason ?? null,
      sizes: data.sizes ?? [],
      brand: data.brand ?? null,
    })
    .where(eq(productsTable.id, paramsParsed.data.id))
    .returning();

  res.json({
    ...updated,
    supplierName: supplier.businessName,
    sizes: updated.sizes ?? [],
    createdAt: updated.createdAt?.toISOString() ?? new Date().toISOString(),
  });
});

router.delete("/supplier/products/:id", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const parsed = DeleteProductParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) {
    res.status(404).json({ error: "Supplier not found" });
    return;
  }

  const [existing] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.id));

  if (!existing || existing.supplierId !== supplier.id) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  await db.delete(productsTable).where(eq(productsTable.id, parsed.data.id));
  res.json({ success: true });
});

router.get("/supplier/orders", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) {
    res.status(404).json({ error: "Supplier not found" });
    return;
  }

  const supplierProducts = await db
    .select({ id: productsTable.id })
    .from(productsTable)
    .where(eq(productsTable.supplierId, supplier.id));

  const productIds = supplierProducts.map((p) => p.id);
  if (productIds.length === 0) {
    res.json([]);
    return;
  }

  const orderItems = await db
    .select()
    .from(orderItemsTable)
    .where(inArray(orderItemsTable.productId, productIds));

  const orderIds = [...new Set(orderItems.map((i) => i.orderId))];
  if (orderIds.length === 0) {
    res.json([]);
    return;
  }

  const orders = await db
    .select()
    .from(ordersTable)
    .where(inArray(ordersTable.id, orderIds));

  const result = orders.map((order) => ({
    ...order,
    customerName: order.shippingName ?? "",
    createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
    items: orderItems
      .filter((i) => i.orderId === order.id)
      .map((i) => ({
        id: i.id,
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        price: i.price,
        imageUrl: i.imageUrl,
      })),
  }));

  res.json(result);
});

router.get("/supplier/stats", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) {
    res.status(404).json({ error: "Supplier not found" });
    return;
  }

  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.supplierId, supplier.id));

  const productIds = products.map((p) => p.id);

  if (productIds.length === 0) {
    res.json({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
    return;
  }

  const orderItems = await db
    .select()
    .from(orderItemsTable)
    .where(inArray(orderItemsTable.productId, productIds));

  const orderIds = [...new Set(orderItems.map((i) => i.orderId))];
  const orders = orderIds.length > 0
    ? await db.select().from(ordersTable).where(inArray(ordersTable.id, orderIds))
    : [];

  const totalRevenue = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue,
    pendingOrders,
  });
});

router.get("/supplier/analytics", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) { res.status(404).json({ error: "Supplier not found" }); return; }

  const products = await db.select().from(productsTable).where(eq(productsTable.supplierId, supplier.id));
  const productIds = products.map(p => p.id);

  if (productIds.length === 0) {
    res.json({ monthly: [], topProducts: [], totalRevenue: 0 });
    return;
  }

  const orderItems = await db.select().from(orderItemsTable).where(inArray(orderItemsTable.productId, productIds));
  const orderIds = [...new Set(orderItems.map(i => i.orderId))];
  const orders = orderIds.length > 0 ? await db.select().from(ordersTable).where(inArray(ordersTable.id, orderIds)) : [];

  const monthlyMap: Record<string, { revenue: number; orders: number }> = {};
  for (const order of orders) {
    const date = new Date(order.createdAt ?? new Date());
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, orders: 0 };
    monthlyMap[key].orders++;
    const items = orderItems.filter(i => i.orderId === order.id);
    monthlyMap[key].revenue += items.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  const monthly = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({ month, ...data }));

  const productRevenueMap: Record<number, { name: string; revenue: number; units: number }> = {};
  for (const item of orderItems) {
    if (!productRevenueMap[item.productId]) {
      productRevenueMap[item.productId] = { name: item.productName, revenue: 0, units: 0 };
    }
    productRevenueMap[item.productId].revenue += item.price * item.quantity;
    productRevenueMap[item.productId].units += item.quantity;
  }

  const topProducts = Object.values(productRevenueMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  res.json({ monthly, topProducts });
});

const CreateDiscountBody = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(1),
  minOrderAmount: z.number().optional(),
  maxUses: z.number().optional(),
  expiresAt: z.string().optional(),
});

router.get("/supplier/discounts", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) { res.status(404).json({ error: "Supplier not found" }); return; }

  const codes = await db
    .select()
    .from(discountCodesTable)
    .where(eq(discountCodesTable.supplierId, supplier.id))
    .orderBy(desc(discountCodesTable.createdAt));

  res.json(codes.map(c => ({
    ...c,
    createdAt: c.createdAt?.toISOString() ?? new Date().toISOString(),
    expiresAt: c.expiresAt?.toISOString() ?? null,
  })));
});

router.post("/supplier/discounts", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const parsed = CreateDiscountBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) { res.status(404).json({ error: "Supplier not found" }); return; }

  const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = parsed.data;

  try {
    const [created] = await db.insert(discountCodesTable).values({
      supplierId: supplier.id,
      code,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount ?? null,
      maxUses: maxUses ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning();

    res.status(201).json({
      ...created,
      createdAt: created.createdAt?.toISOString() ?? new Date().toISOString(),
      expiresAt: created.expiresAt?.toISOString() ?? null,
    });
  } catch (e: any) {
    if (e.code === "23505") {
      res.status(409).json({ error: "هذا الكود مستخدم بالفعل" });
    } else {
      res.status(500).json({ error: "حدث خطأ" });
    }
  }
});

router.patch("/supplier/discounts/:id", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) { res.status(404).json({ error: "Supplier not found" }); return; }

  const [existing] = await db.select().from(discountCodesTable).where(eq(discountCodesTable.id, id));
  if (!existing || existing.supplierId !== supplier.id) { res.status(404).json({ error: "Not found" }); return; }

  const allowed = z.object({
    isActive: z.boolean().optional(),
    discountValue: z.number().optional(),
    maxUses: z.number().nullable().optional(),
    expiresAt: z.string().nullable().optional(),
  });
  const body = allowed.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }

  const updates: any = {};
  if (body.data.isActive !== undefined) updates.isActive = body.data.isActive;
  if (body.data.discountValue !== undefined) updates.discountValue = body.data.discountValue;
  if (body.data.maxUses !== undefined) updates.maxUses = body.data.maxUses;
  if (body.data.expiresAt !== undefined) updates.expiresAt = body.data.expiresAt ? new Date(body.data.expiresAt) : null;

  const [updated] = await db.update(discountCodesTable).set(updates).where(eq(discountCodesTable.id, id)).returning();
  res.json({ ...updated, createdAt: updated.createdAt?.toISOString() ?? "", expiresAt: updated.expiresAt?.toISOString() ?? null });
});

router.delete("/supplier/discounts/:id", requireAuth, requireRole("supplier"), async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const supplier = await getSupplierForUser(req.user!.userId);
  if (!supplier) { res.status(404).json({ error: "Supplier not found" }); return; }

  const [existing] = await db.select().from(discountCodesTable).where(eq(discountCodesTable.id, id));
  if (!existing || existing.supplierId !== supplier.id) { res.status(404).json({ error: "Not found" }); return; }

  await db.delete(discountCodesTable).where(eq(discountCodesTable.id, id));
  res.json({ success: true });
});

export default router;
