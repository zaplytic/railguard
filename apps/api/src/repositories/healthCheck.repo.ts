import { singleton } from "tsyringe";

import db from "@/db";

@singleton()
export default class HealthCheckRepository {
  constructor() {}

  async dbSelectOne(): Promise<void> {
    await db.execute("SELECT 1");
  }
}
