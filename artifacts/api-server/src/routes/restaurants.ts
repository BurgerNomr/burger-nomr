import { Router, type IRouter } from "express";
import { db, restaurantsTable, reviewsTable } from "@workspace/db";
import {
  CreateRestaurantBody,
  GetRestaurantParams,
  ListRestaurantsQueryParams,
  GetRecentRestaurantsQueryParams,
} from "@workspace/api-zod";
import { eq, desc, ilike, avg, count, and, sql } from "drizzle-orm";

const router: IRouter = Router();

function formatRestaurant(r: {
  id: string;
  name: string;
  area: string;
  address: string;
  description: string;
  image_url: string | null;
  price_range: string | null;
  tags: string[];
  certifications: string[];
  latitude: string | null;
  longitude: string | null;
  created_at: Date;
  avg_score: string | null;
  kashif_score: string | null;
  total_noms: string | bigint;
}) {
  return {
    ...r,
    avg_score: r.avg_score ? Number(r.avg_score) : null,
    kashif_score: r.kashif_score ? Number(r.kashif_score) : null,
    total_noms: Number(r.total_noms),
    latitude: r.latitude ? Number(r.latitude) : null,
    longitude: r.longitude ? Number(r.longitude) : null,
    created_at: r.created_at.toISOString(),
  };
}

const kashifScoreExpr = sql<string | null>`(SELECT AVG(kn.score) FROM reviews kn WHERE kn.restaurant_id = ${restaurantsTable.id} AND kn.user_name = 'Kashif')`;

router.get("/restaurants", async (req, res): Promise<void> => {
  const parsed = ListRestaurantsQueryParams.safeParse(req.query);
  const params = parsed.success ? parsed.data : { limit: 20, offset: 0 };

  const conditions = [];
  if (params.search) conditions.push(ilike(restaurantsTable.name, `%${params.search}%`));
  if (params.area) conditions.push(ilike(restaurantsTable.area, `%${params.area}%`));

  const rows = await db
    .select({
      id: restaurantsTable.id,
      name: restaurantsTable.name,
      area: restaurantsTable.area,
      address: restaurantsTable.address,
      description: restaurantsTable.description,
      image_url: restaurantsTable.image_url,
      price_range: restaurantsTable.price_range,
      tags: restaurantsTable.tags,
      certifications: restaurantsTable.certifications,
      latitude: restaurantsTable.latitude,
      longitude: restaurantsTable.longitude,
      created_at: restaurantsTable.created_at,
      avg_score: avg(reviewsTable.score),
      kashif_score: kashifScoreExpr,
      total_noms: count(reviewsTable.id),
    })
    .from(restaurantsTable)
    .leftJoin(reviewsTable, eq(restaurantsTable.id, reviewsTable.restaurant_id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(restaurantsTable.id)
    .orderBy(desc(restaurantsTable.created_at))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);

  res.json(rows.map(formatRestaurant));
});

router.get("/restaurants/top", async (req, res): Promise<void> => {
  const mode = (req.query.mode as string) ?? "community";

  if (mode === "kashif") {
    const result = await db.execute(sql`
      SELECT
        r.id, r.name, r.area, r.address, r.description, r.image_url,
        r.price_range, r.tags, r.certifications, r.latitude, r.longitude, r.created_at,
        AVG(n.score) FILTER (WHERE n.user_name != 'Kashif') AS avg_score,
        AVG(n.score) FILTER (WHERE n.user_name = 'Kashif') AS kashif_score,
        COUNT(n.id) AS total_noms
      FROM restaurants r
      JOIN reviews n ON n.restaurant_id = r.id AND n.user_name = 'Kashif'
      GROUP BY r.id
      ORDER BY kashif_score DESC
      LIMIT 10
    `);

    res.json(
      result.rows.map((r: Record<string, unknown>, i: number) => ({
        ...r,
        avg_score: r.avg_score ? Number(r.avg_score) : null,
        kashif_score: r.kashif_score ? Number(r.kashif_score) : null,
        total_noms: Number(r.total_noms),
        latitude: r.latitude ? Number(r.latitude) : null,
        longitude: r.longitude ? Number(r.longitude) : null,
        created_at: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
        rank: i + 1,
      }))
    );
    return;
  }

  // Community mode
  const rows = await db
    .select({
      id: restaurantsTable.id,
      name: restaurantsTable.name,
      area: restaurantsTable.area,
      address: restaurantsTable.address,
      description: restaurantsTable.description,
      image_url: restaurantsTable.image_url,
      price_range: restaurantsTable.price_range,
      tags: restaurantsTable.tags,
      certifications: restaurantsTable.certifications,
      latitude: restaurantsTable.latitude,
      longitude: restaurantsTable.longitude,
      created_at: restaurantsTable.created_at,
      avg_score: avg(reviewsTable.score),
      kashif_score: kashifScoreExpr,
      total_noms: count(reviewsTable.id),
    })
    .from(restaurantsTable)
    .leftJoin(reviewsTable, eq(restaurantsTable.id, reviewsTable.restaurant_id))
    .groupBy(restaurantsTable.id)
    .orderBy(desc(avg(reviewsTable.score)))
    .limit(10);

  res.json(rows.map((r, i) => ({ ...formatRestaurant(r), rank: i + 1 })));
});

router.get("/restaurants/recent", async (req, res): Promise<void> => {
  const parsed = GetRecentRestaurantsQueryParams.safeParse(req.query);
  const limit = parsed.success ? (parsed.data.limit ?? 6) : 6;
  const area = req.query.area as string | undefined;

  const conditions = area ? [ilike(restaurantsTable.area, `%${area}%`)] : [];

  const rows = await db
    .select({
      id: restaurantsTable.id,
      name: restaurantsTable.name,
      area: restaurantsTable.area,
      address: restaurantsTable.address,
      description: restaurantsTable.description,
      image_url: restaurantsTable.image_url,
      price_range: restaurantsTable.price_range,
      tags: restaurantsTable.tags,
      certifications: restaurantsTable.certifications,
      latitude: restaurantsTable.latitude,
      longitude: restaurantsTable.longitude,
      created_at: restaurantsTable.created_at,
      avg_score: avg(reviewsTable.score),
      kashif_score: kashifScoreExpr,
      total_noms: count(reviewsTable.id),
    })
    .from(restaurantsTable)
    .leftJoin(reviewsTable, eq(restaurantsTable.id, reviewsTable.restaurant_id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .groupBy(restaurantsTable.id)
    .orderBy(desc(restaurantsTable.created_at))
    .limit(limit);

  res.json(rows.map(formatRestaurant));
});

router.get("/restaurants/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetRestaurantParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const rows = await db
    .select({
      id: restaurantsTable.id,
      name: restaurantsTable.name,
      area: restaurantsTable.area,
      address: restaurantsTable.address,
      description: restaurantsTable.description,
      image_url: restaurantsTable.image_url,
      price_range: restaurantsTable.price_range,
      tags: restaurantsTable.tags,
      certifications: restaurantsTable.certifications,
      latitude: restaurantsTable.latitude,
      longitude: restaurantsTable.longitude,
      created_at: restaurantsTable.created_at,
      avg_score: avg(reviewsTable.score),
      kashif_score: kashifScoreExpr,
      total_noms: count(reviewsTable.id),
    })
    .from(restaurantsTable)
    .leftJoin(reviewsTable, eq(restaurantsTable.id, reviewsTable.restaurant_id))
    .where(eq(restaurantsTable.id, params.data.id))
    .groupBy(restaurantsTable.id);

  if (rows.length === 0) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }

  const noms = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.restaurant_id, params.data.id))
    .orderBy(desc(reviewsTable.created_at));

  res.json({
    ...formatRestaurant(rows[0]),
    noms: noms.map((n) => ({
      ...n,
      score: Number(n.score),
      created_at: n.created_at.toISOString(),
    })),
  });
});

router.get("/restaurants/:id/noms", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const noms = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.restaurant_id, raw))
    .orderBy(desc(reviewsTable.created_at));

  res.json(
    noms.map((n) => ({
      ...n,
      score: Number(n.score),
      created_at: n.created_at.toISOString(),
    }))
  );
});

router.post("/restaurants", async (req, res): Promise<void> => {
  const parsed = CreateRestaurantBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [restaurant] = await db
    .insert(restaurantsTable)
    .values({
      ...parsed.data,
      tags: parsed.data.tags ?? [],
      certifications: (parsed.data as { certifications?: string[] }).certifications ?? [],
    })
    .returning();

  res.status(201).json({
    ...restaurant,
    avg_score: null,
    kashif_score: null,
    total_noms: 0,
    latitude: restaurant.latitude ? Number(restaurant.latitude) : null,
    longitude: restaurant.longitude ? Number(restaurant.longitude) : null,
    created_at: restaurant.created_at.toISOString(),
  });
});

export default router;
