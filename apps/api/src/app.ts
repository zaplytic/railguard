import express, { Express } from "express";
import rootRouter from "@/routers";
import { httpLogger } from "@/config/logger";

const app: Express = express();

app.use(httpLogger);

app.use("/api", rootRouter);

app.use(express.json());

export default app;
