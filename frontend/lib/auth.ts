import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Neon/some hosted Postgres
        }
    }),
    baseURL: process.env.BETTER_AUTH_URL || 
             process.env.NEXT_PUBLIC_AUTH_URL || 
             "https://hackathon2-frontend-one.vercel.app",
    emailAndPassword: {
        enabled: true
    },
    // Optional: add secondary providers here later
})
