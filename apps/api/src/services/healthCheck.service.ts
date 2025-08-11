import logger from "@/config/logger";
import { DATABASE_URL } from "@/config/secrets";
import { healthCheckRepo } from "@/repositories";
import { DrizzleError, DrizzleQueryError } from "drizzle-orm";

export default class HealthCheckService {
  async dbConnectionCheck(): Promise<void> {
    logger.info(DATABASE_URL);
    try {
      await healthCheckRepo.dbSelectOne();
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
