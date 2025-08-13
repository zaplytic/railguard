import { uuid, timestamp, varchar, pgTable } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  owner_id: uuid().notNull(),
  api_key: uuid().notNull().unique(),
  created_at: timestamp().defaultNow().notNull(),
});
