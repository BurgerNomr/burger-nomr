import { Router, type IRouter } from "express";
import { db, reviewsTable, restaurantsTable } from "@workspace/db";
import { CreateNomBody } from "@workspace/api-zod";
import { eq, desc, avg, count, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/noms/kashif/featured", async (_req, res): Promise<void> => {
  const result = await db.execute(sql`
    SELECT
      n.id AS nom_id, n.restaurant_id, n.user_id, n.user_name, n.user_avatar,
      n.score, n.burger_ordered, n.comment, n.created_at AS nom_created_at,
      r.id AS r_id, r.name, r.area, r.address, r.description,
      r.image_url, r.price_range, r.tags, r.certifications, r.latitude, r.longitude,
      r.created_at AS r_created_at,
      (SELECT AVG(a.score) FROM reviews a WHERE a.restaurant_id = r.id) AS avg_score,
      (SELECT AVG(k.score) FROM reviews k WHERE k.restaurant_id = r.id AND k.user_name = 'Kashif') AS kashif_score,
      (SELECT COUNT(*) FROM reviews c WHERE c.restaurant_id = r.id) AS total_noms
    FROM reviews n
    JOIN restaurants r ON r.id = n.restaurant_id
    WHERE n.user_name = 'Kashif'
    ORDER BY n.score DESC
    LIMIT 1
  `);

  if (!result.rows.length) {
    res.status(404).json({ error: "No featured nom available" });
    return;
  }

  const row = result.rows[0] as Record<string, unknown>;

  res.json({
    nom: {
      id: row.nom_id,
      restaurant_id: row.restaurant_id,
      user_id: row.user_id,
      user_name: row.user_name,
      user_avatar: row.user_avatar ?? null,
      score: Number(row.score),
      burger_ordered: row.burger_ordered ?? null,
      comment: row.comment ?? null,
      created_at: row.nom_created_at instanceof Date
        ? row.nom_created_at.toISOString()
        : String(row.nom_created_at),
    },
    restaurant: {
      id: row.r_id,
      name: row.name,
      area: row.area,
      address: row.address,
      description: row.description,
      image_url: row.image_url ?? null,
      price_range: row.price_range ?? null,
      tags: row.tags ?? [],
      certifications: row.certifications ?? [],
      latitude: row.latitude ? Number(row.latitude) : null,
      longitude: row.longitude ? Number(row.longitude) : null,
      created_at: row.r_created_at instanceof Date
        ? row.r_created_at.toISOString()
        : String(row.r_created_at),
      avg_score: row.avg_score ? Number(row.avg_score) : null,
      kashif_score: row.kashif_score ? Number(row.kashif_score) : null,
      total_noms: Number(row.total_noms),
    },
  });
});

router.post("/noms", async (req, res): Promise<void> => {
  const parsed = CreateNomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [nom] = await db
    .insert(reviewsTable)
    .values({
      restaurant_id: parsed.data.restaurant_id,
      user_id: parsed.data.user_id,
      user_name: parsed.data.user_name,
      user_avatar: parsed.data.user_avatar ?? null,
      score: String(parsed.data.score),
      burger_ordered: parsed.data.burger_ordered ?? null,
      comment: parsed.data.comment ?? null,
    })
    .returning();

  res.status(201).json({
    ...nom,
    score: Number(nom.score),
    created_at: nom.created_at.toISOString(),
  });
});

export default router;
