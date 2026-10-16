import { Type, Static } from "@sinclair/typebox";

export const UuidSchema = Type.String({ format: "uuid" });

export type UuidSchemaType = Static<typeof UuidSchema>;
