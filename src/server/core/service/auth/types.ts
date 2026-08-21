import type { IDBClient } from "@/src/server/core/db/access/client/dbClient";
import { GroupMemberSchemaType } from "../../../../schemas/groups/groupMembersSchema";
import { GroupAction } from "../types";

export type RbacDB = Pick<IDBClient, "groupMembers">;

export interface IRoleBasedAccessHandler {
  can(
    user_id: GroupMemberSchemaType["user_id"] | undefined,
    group_id: GroupMemberSchemaType["group_id"],
    action: GroupAction,
  ): Promise<boolean>;
}
