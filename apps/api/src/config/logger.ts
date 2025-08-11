import { pinoHttp } from "pino-http";
import pino from "pino";
import { ENVIRONMENT } from "@/config/secrets";

const logTarget = ENVIRONMENT === "development" ? "pino-pretty" : "pino/file";

const transport = pino.transport({
  targets: [
    {
      target: logTarget,
      options: {
        colorize: true,
        destination: `./${ENVIRONMENT}.log`,
      },
    },
    {
      target: logTarget,
      options: {
        destination: 1,
        ignore: "pid,hostname,req.headers,res.headers",
      },
    },
  ],
});

export const httpLogger = pinoHttp(
  {
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream([transport]),
);

const logger = httpLogger.logger;

export default logger;
