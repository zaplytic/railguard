import { healthCheck } from "@/controllers/healthcheck";

import { Router } from "express";

const healthCheckRouter: Router = Router();
healthCheckRouter.get("/", healthCheck);

export default healthCheckRouter;
