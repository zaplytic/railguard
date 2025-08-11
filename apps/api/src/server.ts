import app from "@/app";
import * as secrets from "@/config/secrets";
import logger from "@/config/logger";
import { healthCheckService } from "@/services";

app.listen(secrets.PORT, async () => {
  await healthCheckService.dbConnectionCheck();
  logger.info(
    `Server is running on port ${secrets.PORT} in ${secrets.ENVIRONMENT}`,
  );
});
