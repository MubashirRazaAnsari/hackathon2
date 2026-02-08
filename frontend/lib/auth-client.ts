import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    // In local development, this points to your Next.js app's URL
    // Better Auth will look for the [ ...auth ] route under this base URL
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})

export const { signIn, signUp, signOut, useSession } = authClient;
