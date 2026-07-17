import { AttendanceDictionaryType } from "@/src/lib/types/hooks/types";
import type { AsyncState } from "@/src/lib/types/state/types";
import { PublicUserSchemaType } from "@/src/schemas/auth/userSchema";

export type UserKind = "authenticated" | "anonymous";

export type AuthenticationState = AsyncState<PublicUserSchemaType["email"]>;

export type AuthenticateUserPayload = {
  status: "ok";
  email: string;
  attendanceDictionary: AttendanceDictionaryType;
};
