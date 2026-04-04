import { pgTable, text, uuid, numeric, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const restaurantsTable = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  area: text("area").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull(),
  image_url: text("image_url"),
  price_range: text("price_range"),
  tags: text("tags").array().notNull().default([]),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRestaurantSchema = createInsertSchema(restaurantsTable).omit({ id: true, created_at: true });
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurantsTable.$inferSelect;
