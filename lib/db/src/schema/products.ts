import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { suppliersTable } from "./suppliers";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull().references(() => suppliersTable.id),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  price: real("price").notNull(),
  originalPrice: real("original_price").notNull(),
  quantity: integer("quantity").notNull().default(0),
  imageUrl: text("image_url"),
  discountReason: text("discount_reason"),
  sizes: text("sizes").array().notNull().default([]),
  brand: text("brand"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
