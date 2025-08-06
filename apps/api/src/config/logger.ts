import { pinoHttp } from "pino-http";
import pino from "pino";
import { LOG_LEVEL, ENVIRONMENT } from "@/config/secrets";

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

const logger = pinoHttp(
  {
    level: LOG_LEVEL,
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.multistream([transport]),
);

export default logger;
