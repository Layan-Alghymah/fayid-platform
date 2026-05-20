import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { productsTable, suppliersTable } from "@workspace/db";
import { eq, ilike, gte, lte, and, inArray, type SQL, sql } from "drizzle-orm";
import { ListProductsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

function productWithSupplier(products: any[], suppliers: any[]) {
  return products.map((p) => {
    const s = suppliers.find((s) => s.id === p.supplierId);
    return {
      ...p,
      supplierName: s?.businessName ?? "",
      sizes: p.sizes ?? [],
      createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
    };
  });
}

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, minPrice, maxPrice, brand, search, limit = 20, offset = 0 } = parsed.data;

  const conditions: SQL[] = [eq(productsTable.isActive, true)];

  if (category) conditions.push(eq(productsTable.category, category));
  if (minPrice !== undefined) conditions.push(gte(productsTable.price, minPrice));
  if (maxPrice !== undefined) conditions.push(lte(productsTable.price, maxPrice));
  if (brand) conditions.push(ilike(productsTable.brand!, `%${brand}%`));
  if (search) {
    conditions.push(
      sql`(${productsTable.name} ILIKE ${`%${search}%`} OR ${productsTable.description} ILIKE ${`%${search}%`})`
    );
  }

  const products = await db
    .select()
    .from(productsTable)
    .where(and(...conditions))
    .limit(limit)
    .offset(offset)
    .orderBy(productsTable.createdAt);

  const supplierIds = [...new Set(products.map((p) => p.supplierId))];
  const suppliers = supplierIds.length > 0
    ? await db.select().from(suppliersTable).where(inArray(suppliersTable.id, supplierIds))
    : [];

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(productsTable)
    .where(and(...conditions));

  res.json({
    products: productWithSupplier(products, suppliers),
    total: Number(countResult[0]?.count ?? 0),
  });
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [supplier] = await db.select().from(suppliersTable).where(eq(suppliersTable.id, product.supplierId));

  res.json({
    ...product,
    supplierName: supplier?.businessName ?? "",
    sizes: product.sizes ?? [],
    createdAt: product.createdAt?.toISOString() ?? new Date().toISOString(),
  });
});

export default router;
