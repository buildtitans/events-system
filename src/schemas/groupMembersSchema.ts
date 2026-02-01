import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { Static } from "@sinclair/typebox";

const GroupMembersSchema = Type.Object({
    group_id: Type.String(),
    user_id: Type.String(),
    role: Type.Union([
        Type.Literal("member"),
        Type.Literal("organizer"),
        Type.Literal("anonymous")
    ]),
    joined_at: Type.String()
});

const GroupIDForInsertSchema = Type.String();

type GroupMembersSchemaType = Static<typeof GroupMembersSchema>;

type GroupIDForInsertSchemaType = Static<typeof GroupIDForInsertSchema>;

export { GroupMembersSchema, GroupIDForInsertSchema };

export type { GroupMembersSchemaType, GroupIDForInsertSchemaType };

export const GroupIDForInsertSchemaValidator = TypeCompiler.Compile(GroupIDForInsertSchema);

export const GroupMembersSchemaValidator = TypeCompiler.Compile(GroupMembersSchema);