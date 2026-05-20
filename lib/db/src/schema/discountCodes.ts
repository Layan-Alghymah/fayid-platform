import { pgTable, text, serial, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { suppliersTable } from "./suppliers";

export const discountCodesTable = pgTable("discount_codes", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").notNull().references(() => suppliersTable.id),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull().default("percentage"),
  discountValue: real("discount_value").notNull(),
  minOrderAmount: real("min_order_amount"),
  maxUses: integer("max_uses"),
  usesCount: integer("uses_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type DiscountCode = typeof discountCodesTable.$inferSelect;
