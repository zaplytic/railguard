import app from "@/app";
import * as secrets from "@/config/secrets";
import logger from "@/config/logger";

app.listen(secrets.PORT, () => {
  logger.logger.info(
    `Server is running on port ${secrets.PORT} in ${secrets.ENVIRONMENT}`,
  );
});
