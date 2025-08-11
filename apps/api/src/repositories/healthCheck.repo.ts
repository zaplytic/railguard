import db from "@/db";

export default class HealthCheckRepo {
  async dbSelectOne(): Promise<void> {
    await db.execute("SELECT 1");
  }
}
