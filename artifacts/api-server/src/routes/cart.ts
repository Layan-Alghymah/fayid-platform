import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable, suppliersTable } from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";
import { requireAuth } from "../middleware/requireAuth";
import { AddToCartBody, UpdateCartItemBody, UpdateCartItemParams, RemoveFromCartParams } from "@workspace/api-zod";

const router: IRouter = Router();

async function getCartWithProducts(userId: number) {
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId));

  const productIds = items.map((i) => i.productId);
  const products = productIds.length > 0
    ? await db.select().from(productsTable).where(inArray(productsTable.id, productIds))
    : [];

  const supplierIds = [...new Set(products.map((p) => p.supplierId))];
  const suppliers = supplierIds.length > 0
    ? await db.select().from(suppliersTable).where(inArray(suppliersTable.id, supplierIds))
    : [];

  const enrichedItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const supplier = suppliers.find((s) => s.id === product?.supplierId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      product: product
        ? {
            ...product,
            supplierName: supplier?.businessName ?? "",
            sizes: product.sizes ?? [],
            createdAt: product.createdAt?.toISOString() ?? new Date().toISOString(),
          }
        : null,
    };
  }).filter((i) => i.product !== null);

  const total = enrichedItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
  return { items: enrichedItems, total };
}

const SUPPLIER_CART_ERROR = "حساب المورد مخصص لإدارة المنتجات والطلبات، ولا يمكنه إتمام عمليات الشراء.";

router.get("/cart", requireAuth, async (req, res): Promise<void> => {
  if (req.user!.role === "supplier") {
    res.status(403).json({ error: SUPPLIER_CART_ERROR });
    return;
  }
  const cart = await getCartWithProducts(req.user!.userId);
  res.json(cart);
});

router.post("/cart/items", requireAuth, async (req, res): Promise<void> => {
  if (req.user!.role === "supplier") {
    res.status(403).json({ error: SUPPLIER_CART_ERROR });
    return;
  }
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { productId, quantity } = parsed.data;
  const userId = req.user!.userId;

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({ userId, productId, quantity });
  }

  const cart = await getCartWithProducts(userId);
  res.json(cart);
});

router.patch("/cart/items/:productId", requireAuth, async (req, res): Promise<void> => {
  if (req.user!.role === "supplier") {
    res.status(403).json({ error: SUPPLIER_CART_ERROR });
    return;
  }
  const paramsParsed = UpdateCartItemParams.safeParse(req.params);
  if (!paramsParsed.success) {
    res.status(400).json({ error: paramsParsed.error.message });
    return;
  }

  const bodyParsed = UpdateCartItemBody.safeParse(req.body);
  if (!bodyParsed.success) {
    res.status(400).json({ error: bodyParsed.error.message });
    return;
  }

  const userId = req.user!.userId;
  const { productId } = paramsParsed.data;
  const { quantity } = bodyParsed.data;

  if (quantity <= 0) {
    await db
      .delete(cartItemsTable)
      .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
  } else {
    await db
      .update(cartItemsTable)
      .set({ quantity })
      .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, productId)));
  }

  const cart = await getCartWithProducts(userId);
  res.json(cart);
});

router.delete("/cart/items/:productId", requireAuth, async (req, res): Promise<void> => {
  if (req.user!.role === "supplier") {
    res.status(403).json({ error: SUPPLIER_CART_ERROR });
    return;
  }
  const parsed = RemoveFromCartParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = req.user!.userId;
  await db
    .delete(cartItemsTable)
    .where(and(eq(cartItemsTable.userId, userId), eq(cartItemsTable.productId, parsed.data.productId)));

  const cart = await getCartWithProducts(userId);
  res.json(cart);
});

router.delete("/cart/clear", requireAuth, async (req, res): Promise<void> => {
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, req.user!.userId));
  res.json({ success: true });
});

export default router;
