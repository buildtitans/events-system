import type {
  GroupSearchResultSchemaType,
  GroupSearchSuggestionSchemaType,
} from "@/src/schemas/search/searchSchema";
import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import type { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";
import type { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import type {
  ArchivedEventSchemaType,
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { TimelineElementSchemaType } from "../../../../../schemas/groups/timelineSchema";
import { GroupEventSummarySchemaType } from "../../../../../schemas/events/eventSchema";

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
  calandar(id: GroupSchemaType["id"]): Promise<TimelineElementSchemaType[]>;
  archives(
    user_id: AuthenticatedUserId | undefined | null,
    id: GroupSchemaType["id"],
  ): Promise<ArchivedEventSchemaType[]>;
  categories(): Promise<CategoriesSchemaType>;
  searchGroups(query: string): Promise<GroupSearchResultSchemaType[]>;
  suggestGroups(query: string): Promise<GroupSearchSuggestionSchemaType[]>;
  pastEvents(id: string): Promise<GroupEventSummarySchemaType[]>;
}
