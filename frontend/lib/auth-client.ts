import { createAuthClient } from "better-auth/react"

const getAuthBaseURL = () => {
    // Priority: AUTH_URL > APP_URL > BETTER_AUTH_URL
    const url = process.env.NEXT_PUBLIC_AUTH_URL || 
                process.env.NEXT_PUBLIC_APP_URL || 
                process.env.BETTER_AUTH_URL;
                
    if (!url || url.startsWith('/')) {
        // Fallback to a valid absolute URL during build/prerender
        return typeof window !== 'undefined' 
            ? window.location.origin 
            : "https://hackathon2-frontend-one.vercel.app";
    }
    return url;
}

export const authClient = createAuthClient({
    baseURL: getAuthBaseURL()
})

export const { signIn, signUp, signOut, useSession } = authClient;
