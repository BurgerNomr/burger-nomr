import { Router, type IRouter } from "express";
import { db, reviewsTable } from "@workspace/db";
import { CreateReviewBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      restaurant_id: parsed.data.restaurant_id,
      user_id: parsed.data.user_id,
      user_name: parsed.data.user_name,
      user_avatar: parsed.data.user_avatar ?? null,
      overall_rating: String(parsed.data.overall_rating),
      patty_rating: String(parsed.data.patty_rating),
      bun_rating: String(parsed.data.bun_rating),
      sauce_rating: String(parsed.data.sauce_rating),
      value_rating: String(parsed.data.value_rating),
      comment: parsed.data.comment ?? null,
    })
    .returning();

  res.status(201).json({
    ...review,
    overall_rating: Number(review.overall_rating),
    patty_rating: Number(review.patty_rating),
    bun_rating: Number(review.bun_rating),
    sauce_rating: Number(review.sauce_rating),
    value_rating: Number(review.value_rating),
    created_at: review.created_at.toISOString(),
  });
});

export default router;
