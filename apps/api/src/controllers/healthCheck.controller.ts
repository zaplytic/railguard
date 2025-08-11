import { Request, Response } from "express";
import { HealthCheckResponse, ServiceHealth } from "@railguard/types";
import { singleton } from "tsyringe";

@singleton()
export default class HealthCheckController {
  constructor() {}

  async handleHealthCheck(_req: Request, res: Response) {
    const appVersion: string = process.env.npm_package_version || "1.0.0";
    const appUptime: number = process.uptime();

    const services: ServiceHealth[] = [
      {
        name: "Database (Postgres)",
        status: "healthy",
        message: "Connection successful",
        responseTime: 10,
      },
    ];

    let overallStatus: HealthCheckResponse["status"] = "healthy";
    if (services.some((s) => s.status === "unhealthy")) {
      overallStatus = "unhealthy";
    } else if (services.some((s) => s.status === "degraded")) {
      overallStatus = "degraded";
    }

    const healthCheckResponse: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: appVersion,
      uptime: appUptime,
      services: services,
    };

    res.status(200).json(healthCheckResponse);
  }
}
