import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, suppliersTable, productsTable, ordersTable, orderItemsTable } from "@workspace/db";
import { eq, inArray, sql } from "drizzle-orm";
import { requireAuth, requireRole } from "../middleware/requireAuth";
import { ApproveSupplierParams, AdminDeleteProductParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/admin/suppliers", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const suppliers = await db.select().from(suppliersTable).orderBy(suppliersTable.createdAt);

  const userIds = suppliers.map((s) => s.userId);
  const users = userIds.length > 0
    ? await db.select().from(usersTable).where(inArray(usersTable.id, userIds))
    : [];

  res.json(suppliers.map((s) => {
    const user = users.find((u) => u.id === s.userId);
    return {
      id: s.id,
      userId: s.userId,
      businessName: s.businessName,
      verificationStatus: s.verificationStatus,
      userName: user?.name ?? "",
      userEmail: user?.email ?? "",
    };
  }));
});

router.patch("/admin/suppliers/:id/approve", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const parsed = ApproveSupplierParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [supplier] = await db
    .update(suppliersTable)
    .set({ verificationStatus: "approved" })
    .where(eq(suppliersTable.id, parsed.data.id))
    .returning();

  if (!supplier) {
    res.status(404).json({ error: "Supplier not found" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, supplier.userId));

  res.json({
    id: supplier.id,
    userId: supplier.userId,
    businessName: supplier.businessName,
    verificationStatus: supplier.verificationStatus,
    userName: user?.name ?? "",
    userEmail: user?.email ?? "",
  });
});

router.get("/admin/products", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable).orderBy(productsTable.createdAt);

  const supplierIds = [...new Set(products.map((p) => p.supplierId))];
  const suppliers = supplierIds.length > 0
    ? await db.select().from(suppliersTable).where(inArray(suppliersTable.id, supplierIds))
    : [];

  res.json(products.map((p) => {
    const s = suppliers.find((s) => s.id === p.supplierId);
    return {
      ...p,
      supplierName: s?.businessName ?? "",
      sizes: p.sizes ?? [],
      createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
    };
  }));
});

router.delete("/admin/products/:id", requireAuth, requireRole("admin"), async (req, res): Promise<void> => {
  const parsed = AdminDeleteProductParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.delete(productsTable).where(eq(productsTable.id, parsed.data.id));
  res.json({ success: true });
});

router.get("/admin/orders", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);

  const userIds = [...new Set(orders.map((o) => o.userId))];
  const users = userIds.length > 0
    ? await db.select().from(usersTable).where(inArray(usersTable.id, userIds))
    : [];

  const allOrderItems = await db.select().from(orderItemsTable);

  res.json(orders.map((order) => {
    const user = users.find((u) => u.id === order.userId);
    const items = allOrderItems.filter((i) => i.orderId === order.id);
    return {
      ...order,
      customerName: user?.name ?? order.shippingName ?? "",
      createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
      items: items.map((i) => ({
        id: i.id,
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        price: i.price,
        imageUrl: i.imageUrl,
      })),
    };
  }));
});

router.get("/admin/stats", requireAuth, requireRole("admin"), async (_req, res): Promise<void> => {
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(usersTable);
  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(productsTable);
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable);
  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(suppliersTable)
    .where(eq(suppliersTable.verificationStatus, "pending"));

  const [revenueResult] = await db
    .select({ total: sql<number>`coalesce(sum(total_price), 0)` })
    .from(ordersTable);

  res.json({
    totalUsers: Number(userCount?.count ?? 0),
    totalProducts: Number(productCount?.count ?? 0),
    totalOrders: Number(orderCount?.count ?? 0),
    totalRevenue: Number(revenueResult?.total ?? 0),
    pendingSuppliers: Number(pendingCount?.count ?? 0),
  });
});

export default router;
