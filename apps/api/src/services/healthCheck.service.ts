import { DrizzleError, DrizzleQueryError } from "drizzle-orm";
import { singleton } from "tsyringe";

import logger from "@/config/logger";
import HealthCheckRepository from "@/repositories/healthCheck.repo";

@singleton()
export default class HealthCheckService {
  constructor(private readonly healthCheckRepo: HealthCheckRepository) {}

  async dbConnectionCheck(): Promise<void> {
    try {
      await this.healthCheckRepo.dbSelectOne();
      logger.info("Database connected successfully");
    } catch (error) {
      if (error instanceof DrizzleError) {
        logger.error({ error: error }, "Database connection error: ");
      } else if (error instanceof DrizzleQueryError) {
        logger.error({ error: error }, "Database query error: ");
      } else if (error instanceof Error) {
        logger.error(
          { error: error },
          "Unexpected error during database check: ",
        );
      }
    }
  }
}
