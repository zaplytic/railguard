import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from "@/config/secrets";

const db = drizzle(DATABASE_URL);

export default db;
