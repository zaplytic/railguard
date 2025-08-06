import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT = process.env.PORT || 3000;

export const ENVIRONMENT = process.env.NODE_ENV || "development";

export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
