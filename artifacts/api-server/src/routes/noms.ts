import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { CreateNomBody } from "@workspace/api-zod";

const router: IRouter = Router();

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
