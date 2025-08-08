import logger from "@/config/logger";
import { healthCheckRepo } from "@/repositories";

export default class HealthCheckService {
  async dbConnectionCheck(): Promise<void> {
    try {
      await healthCheckRepo.dbSelectOne();
      logger.logger.info("Database connected successfully");
    } catch (error) {
      logger.logger.error("Database connection failed");
    }
  }
}
