import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, suppliersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, signToken } from "../lib/auth";
import { requireAuth } from "../middleware/requireAuth";
import { RegisterBody, LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/auth/register", async (req, res): Promise<void> => {
  try {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { name, email, password, role, businessName } = parsed.data;

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(usersTable).values({ name, email, passwordHash, role }).returning();

    let supplierId: number | null = null;
    let supplierStatus: string | null = null;

    if (role === "supplier" && businessName) {
      const [supplier] = await db.insert(suppliersTable).values({
        userId: user.id,
        businessName,
        verificationStatus: "pending",
      }).returning();
      supplierId = supplier.id;
      supplierStatus = supplier.verificationStatus;
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        supplierId,
        supplierStatus,
      },
      token,
    });
  } catch (err) {
    console.error("[POST /api/auth/register] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res): Promise<void> => {
  try {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const { email, password } = parsed.data;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    let supplierId: number | null = null;
    let supplierStatus: string | null = null;

    if (user.role === "supplier") {
      const [supplier] = await db.select().from(suppliersTable).where(eq(suppliersTable.userId, user.id));
      if (supplier) {
        supplierId = supplier.id;
        supplierStatus = supplier.verificationStatus;
      }
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        supplierId,
        supplierStatus,
      },
      token,
    });
  } catch (err) {
    console.error("[POST /api/auth/login] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    let supplierId: number | null = null;
    let supplierStatus: string | null = null;

    if (user.role === "supplier") {
      const [supplier] = await db.select().from(suppliersTable).where(eq(suppliersTable.userId, user.id));
      if (supplier) {
        supplierId = supplier.id;
        supplierStatus = supplier.verificationStatus;
      }
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      supplierId,
      supplierStatus,
    });
  } catch (err) {
    console.error("[GET /api/auth/me] Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/logout", (_req, res): void => {
  res.json({ success: true });
});

export default router;
