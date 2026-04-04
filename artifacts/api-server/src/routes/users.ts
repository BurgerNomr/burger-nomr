import { Router, type IRouter } from "express";
import { db, usersTable, reviewsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/users/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const rows = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      avatar_url: usersTable.avatar_url,
      joined_at: usersTable.joined_at,
      total_noms: count(reviewsTable.id),
    })
    .from(usersTable)
    .leftJoin(reviewsTable, eq(usersTable.id, reviewsTable.user_id))
    .where(eq(usersTable.id, raw))
    .groupBy(usersTable.id);

  if (rows.length === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const u = rows[0];
  res.json({
    ...u,
    total_noms: Number(u.total_noms),
    joined_at: u.joined_at.toISOString(),
  });
});

router.get("/users/:id/noms", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const noms = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.user_id, raw))
    .orderBy(desc(reviewsTable.created_at));

  res.json(
    noms.map((n) => ({
      ...n,
      score: Number(n.score),
      created_at: n.created_at.toISOString(),
    }))
  );
});

export default router;
