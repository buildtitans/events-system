import type { PublicUserSchemaType } from "@/src/schemas/userSchema";

type StoredSession = {
    id: string,
    expires_at: Date,
    user_id: string
}

type AuthClientLoginResponse = {
    user: PublicUserSchemaType,
    session: StoredSession
}




export type { StoredSession, AuthClientLoginResponse };