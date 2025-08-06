import { Router } from "express";
import healthCheckRouter from "@/routers/healthCheckRouter";

const rootRouter: Router = Router();

rootRouter.use("/healthCheck", healthCheckRouter);

export default rootRouter;
