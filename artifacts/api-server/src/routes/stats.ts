import { Router, type IRouter } from "express";
import { db, restaurantsTable, reviewsTable } from "@workspace/db";
import { count, avg, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [restaurantStats] = await db
    .select({ total: count() })
    .from(restaurantsTable);

  const [reviewStats] = await db
    .select({
      total: count(),
      avg_rating: avg(reviewsTable.overall_rating),
    })
    .from(reviewsTable);

  const topAreaRows = await db.execute(
    sql`SELECT area, COUNT(*) as cnt FROM restaurants GROUP BY area ORDER BY cnt DESC LIMIT 1`
  );

  const topAreaRow = topAreaRows.rows?.[0] as { area: string } | undefined;

  res.json({
    total_restaurants: Number(restaurantStats?.total ?? 0),
    total_reviews: Number(reviewStats?.total ?? 0),
    avg_rating_platform: reviewStats?.avg_rating ? Number(reviewStats.avg_rating) : null,
    top_area: topAreaRow?.area ?? null,
  });
});

export default router;
