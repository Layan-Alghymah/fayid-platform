import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, cartItemsTable, productsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { requireAuth } from "../middleware/requireAuth";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";

const router: IRouter = Router();

async function buildOrderResponse(order: any) {
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));

  return {
    ...order,
    customerName: order.shippingName ?? "",
    createdAt: order.createdAt?.toISOString() ?? new Date().toISOString(),
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.imageUrl,
    })),
  };
}

const SUPPLIER_ORDER_ERROR = "حساب المورد مخصص لإدارة المنتجات والطلبات، ولا يمكنه إتمام عمليات الشراء.";

router.get("/orders", requireAuth, async (req, res): Promise<void> => {
  if (req.user!.role === "supplier") {
    res.status(403).json({ error: SUPPLIER_ORDER_ERROR });
    return;
  }
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, req.user!.userId))
    .orderBy(ordersTable.createdAt);

  const detailed = await Promise.all(orders.map(buildOrderResponse));
  res.json(detailed);
});

router.post("/orders", requireAuth, async (req, res): Promise<void> => {
  if (req.user!.role === "supplier") {
    res.status(403).json({ error: SUPPLIER_ORDER_ERROR });
    return;
  }
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, phone, address, paymentMethod, notes } = parsed.data;
  const userId = req.user!.userId;

  const cartItems = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId));

  if (cartItems.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const productIds = cartItems.map((i) => i.productId);
  const products = await db
    .select()
    .from(productsTable)
    .where(inArray(productsTable.id, productIds));

  let totalPrice = 0;
  const orderItemsData = cartItems.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    const price = product?.price ?? 0;
    totalPrice += price * cartItem.quantity;
    return {
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price,
      productName: product?.name ?? "",
      imageUrl: product?.imageUrl ?? null,
    };
  });

  const [order] = await db.insert(ordersTable).values({
    userId,
    totalPrice,
    paymentMethod,
    shippingName: name,
    shippingPhone: phone,
    shippingAddress: address,
    notes: notes ?? null,
    status: "pending",
  }).returning();

  await db.insert(orderItemsTable).values(
    orderItemsData.map((item) => ({ ...item, orderId: order.id }))
  );

  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

  const response = await buildOrderResponse(order);
  res.status(201).json(response);
});

router.get("/orders/:id", requireAuth, async (req, res): Promise<void> => {
  const parsed = GetOrderParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, parsed.data.id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (order.userId !== req.user!.userId && req.user!.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const response = await buildOrderResponse(order);
  res.json(response);
});

export default router;
