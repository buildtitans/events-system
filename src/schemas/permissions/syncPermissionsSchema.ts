import { Type, Static } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { GroupMembersSchema } from "./groupMembersSchema";
import { GroupsSchema } from "../groups/groupSchema";
import { PaginatedLayoutSchema } from "@/src/schemas/layoutSlotSchema";
import { CategoriesSchema } from "../groups/categoriesSchema";

export const SyncTrpcInputSchema = Type.Null();

export const ViewerMembershipsSchema = Type.Array(GroupMembersSchema);

export const GroupsAndMembershipsSchema = Type.Object({
    events: PaginatedLayoutSchema,
    groups: GroupsSchema,
    categories: CategoriesSchema
});

export type SyncTrpcInputSchemaType = Static<typeof SyncTrpcInputSchema>;

export type GroupsAndMembershipsSchemaType = Static<typeof GroupsAndMembershipsSchema>;

export const SyncTrpcInputSchemaValidator = TypeCompiler.Compile(SyncTrpcInputSchema);

export const GroupsAndMembershipsSchemaValidator = TypeCompiler.Compile(GroupMembersSchema);
