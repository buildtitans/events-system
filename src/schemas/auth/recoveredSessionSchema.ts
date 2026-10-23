import { Type, Static } from "@sinclair/typebox";
import { PublicUserSchema } from "./userSchema";

const NoRecoveredSessionSchema = Type.Object(
  {
    kind: Type.Literal("anonymous"),
  },
  { additionalProperties: false },
);

const SessionRecoveredSchema = Type.Object(
  {
    kind: Type.Literal("authenticated"),
    data: Type.Object({
      session: Type.Object({
        id: Type.String({ format: "uuid" }),
        expires_at: Type.String({ format: "date-time" }),
        created_at: Type.String({ format: "date-time" }),
      }),
      user: Type.Object({
        email: PublicUserSchema.properties.email,
      }),
    }),
  },
  { additionalProperties: false },
);

export const RecoveredSessionSchema = Type.Union([
  NoRecoveredSessionSchema,
  SessionRecoveredSchema,
]);

export type RecoveredSessionSchemaType = Static<typeof RecoveredSessionSchema>;
