import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Neon/some hosted Postgres
        }
    }),
    emailAndPassword: {
        enabled: true
    },
    // Optional: add secondary providers here later
})
