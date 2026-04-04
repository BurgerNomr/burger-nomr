import { Router, type IRouter } from "express";
import { db, restaurantsTable, reviewsTable } from "@workspace/db";
import { count, avg, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [restaurantStats] = await db
    .select({ total: count() })
    .from(restaurantsTable);

  const [nomStats] = await db
    .select({
      total: count(),
      avg_score: avg(reviewsTable.score),
    })
    .from(reviewsTable);

  const topAreaRows = await db.execute(
    sql`SELECT area, COUNT(*) as cnt FROM restaurants GROUP BY area ORDER BY cnt DESC LIMIT 1`
  );

  const topAreaRow = topAreaRows.rows?.[0] as { area: string } | undefined;

  res.json({
    total_restaurants: Number(restaurantStats?.total ?? 0),
    total_noms: Number(nomStats?.total ?? 0),
    avg_score_platform: nomStats?.avg_score ? Number(nomStats.avg_score) : null,
    top_area: topAreaRow?.area ?? null,
  });
});

export default router;
