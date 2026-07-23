import { CategoriesSchemaType } from "../../../../../schemas/groups/categoriesSchema";
import { GroupMemberSchemaType } from "../../../../../schemas/groups/groupMembersSchema";
import {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "../../../../../schemas/groups/groupSchema";
import { NameSlugDescriptionLookup } from "../../../lib/utils/buildGroupNameLookup";

export interface IGroupLifecycleHandler {
  createNewGroup(
    user_id: string | undefined | null,
    newGroupInput: NewGroupInputSchemaType,
  ): Promise<
    { ok: true; data: GroupSchemaType } | { ok: false; error: string }
  >;
}

export interface IMembershipHandler {
  addMember(
    user_id: string | undefined,
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<GroupMemberSchemaType>;
  leaveGroup(
    group_id: GroupSchemaType["id"],
    user_id: string | undefined | null,
  ): Promise<boolean>;

  getRoleInGroup(
    user_id: string | undefined,
    group_id: GroupSchemaType["id"],
  ): Promise<GroupMemberSchemaType["role"]>;
  getGroupHeadCount(group_id: GroupSchemaType["id"]): Promise<number>;
}

export interface IGroupQueryHandler {
  getGroupCategories(): Promise<CategoriesSchemaType>;
  getGroupNameDictionary(): Promise<NameSlugDescriptionLookup>;
  getAllGroups(): Promise<GroupSchemaType[]>;
  searchGroups(query: string): Promise<GroupSchemaType[]>;
  getAllGroupMembers(group_id: string): Promise<GroupMemberSchemaType[]>;
  getOrganizerEmail(group_id: string): Promise<{ email: string }>;
  getGroupFromSlug(slug: string): Promise<GroupSchemaType>;
}
