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
      total_reviews: count(reviewsTable.id),
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
    total_reviews: Number(u.total_reviews),
    joined_at: u.joined_at.toISOString(),
  });
});

router.get("/users/:id/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.user_id, raw))
    .orderBy(desc(reviewsTable.created_at));

  res.json(
    reviews.map((r) => ({
      ...r,
      overall_rating: Number(r.overall_rating),
      patty_rating: Number(r.patty_rating),
      bun_rating: Number(r.bun_rating),
      sauce_rating: Number(r.sauce_rating),
      value_rating: Number(r.value_rating),
      created_at: r.created_at.toISOString(),
    }))
  );
});

export default router;
