import { Type, Static } from "@sinclair/typebox";


const PublicUserSchema = Type.Object({
    email: Type.String(),
    id: Type.String()
})

const DbUserSchema = Type.Object({
    email: Type.String(),
    id: Type.String(),
    password_hash: Type.String()
});

type PublicUserSchemaType = Static<typeof PublicUserSchema>;

type DbUserSchemaType = Static<typeof DbUserSchema>;


export { DbUserSchema, PublicUserSchema }

export type { DbUserSchemaType, PublicUserSchemaType };