import type { PublicUserSchemaType } from "@/src/schemas/auth/userSchema";
import { NotificationSchemaArrayType } from "@/src/schemas/notifications/notificationsSchema";

type StoredSession = {
    id: string,
    expires_at: Date,
    user_id: string
}

type AuthClientLoginResponse = {
    user: PublicUserSchemaType,
    session: StoredSession
}


type NotificationCreationProcedure = {
    ok: boolean,
    items: NotificationSchemaArrayType
}

export type { StoredSession, AuthClientLoginResponse, NotificationCreationProcedure };