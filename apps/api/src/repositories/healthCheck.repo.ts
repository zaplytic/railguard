import db from "@/db";
import { DrizzleError, DrizzleQueryError } from "drizzle-orm";

export default class HealthCheckRepo {
  async dbSelectOne(): Promise<void> {
    try {
      await db.execute("SELECT 1");
    } catch (error) {
      switch (true) {
        case error instanceof DrizzleError:
          throw new Error("Database error occurred: " + error.message);
        case error instanceof DrizzleQueryError:
          throw new Error("Query error occurred: " + error.query);
        default:
          throw new Error("An unexpected error occurred: " + error);
      }
    }
  }
}
