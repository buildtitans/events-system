import type { IDBClient } from "@/src/server/core/db/access/client/dbClient";
import { GroupMemberSchemaType } from "../../../../schemas/groups/groupMembersSchema";
import { GroupAction } from "../types";
import type { AuthenticatedUserId } from "../handlers/session/SessionHandler";

export type RbacDB = Pick<IDBClient, "groupMembers">;

export interface IRoleBasedAccessHandler {
  can(
    user_id: AuthenticatedUserId | undefined,
    group_id: GroupMemberSchemaType["group_id"],
    action: GroupAction,
  ): Promise<boolean>;
}
