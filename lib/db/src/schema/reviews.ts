import { pgTable, text, uuid, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reviewsTable = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurant_id: uuid("restaurant_id").notNull(),
  user_id: text("user_id").notNull(),
  user_name: text("user_name").notNull(),
  user_avatar: text("user_avatar"),
  overall_rating: numeric("overall_rating", { precision: 3, scale: 1 }).notNull(),
  patty_rating: numeric("patty_rating", { precision: 3, scale: 1 }).notNull(),
  bun_rating: numeric("bun_rating", { precision: 3, scale: 1 }).notNull(),
  sauce_rating: numeric("sauce_rating", { precision: 3, scale: 1 }).notNull(),
  value_rating: numeric("value_rating", { precision: 3, scale: 1 }).notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, created_at: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviewsTable.$inferSelect;
