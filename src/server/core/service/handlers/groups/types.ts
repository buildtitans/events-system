import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import type {
  CategoriesSchemaType,
  CategorySchemaType,
} from "@/src/schemas/groups/categoriesSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type {
  ArchivedEventSchemaType,
  GroupHydratedSchemaType,
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";

export interface IGroupLifecycleHandler {
  createNewGroup(
    user_id: AuthenticatedUserId | undefined | null,
    newGroupInput: NewGroupInputSchemaType,
  ): Promise<
    { ok: true; data: GroupSchemaType } | { ok: false; error: string }
  >;
}

export interface IMembershipHandler {
  addMember(
    user_id: AuthenticatedUserId | undefined | null,
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType>;
  leaveGroup(
    group_id: GroupSchemaType["id"],
    user_id: AuthenticatedUserId | undefined | null,
  ): Promise<boolean>;

  getRoleInGroup(
    user_id: AuthenticatedUserId | undefined | null,
    group_id: GroupSchemaType["id"],
  ): Promise<GroupMemberSchemaType["role"]>;
}

export interface IGroupQueryHandler {
  hydrateGroup(
    group_id: GroupSchemaType["id"],
  ): Promise<GroupHydratedSchemaType>;
  archives(
    user_id: AuthenticatedUserId | undefined | null,
    id: GroupSchemaType["id"],
  ): Promise<ArchivedEventSchemaType[]>;
  getGroupCategories(): Promise<CategoriesSchemaType>;
  discovery(): Promise<GroupSchemaType[]>;
  searchGroups(query: string): Promise<GroupSchemaType[]>;
  suggestGroups(query: string): Promise<GroupSchemaType[]>;
  byCategory(
    categoryName: CategorySchemaType["name"],
  ): Promise<GroupSchemaType[]>;
}
