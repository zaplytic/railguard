import dotenv from "dotenv";

dotenv.config({ path: ".env", quiet: true });

export const PORT = process.env.PORT || 3000;

export const ENVIRONMENT = process.env.NODE_ENV || "development";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const DATABASE_URL = process.env.DATABASE_URL!;
