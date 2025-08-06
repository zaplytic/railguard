import express, { Express } from "express";
import rootRouter from "@/routers";
import logger from "@/config/logger";

const app: Express = express();

app.use(logger);

app.use("/api", rootRouter);

app.use(express.json());

export default app;
