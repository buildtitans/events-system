import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema"
import type { ViewerAccess } from "../store/slices/GroupMembersSlice";

export const mapGroupAccessPermissions = (
    memberships: GroupMembersSchemaType[] | null,
): ViewerAccess => {
    const accessPermissions: ViewerAccess = {};

    memberships?.forEach((membership) => {
        accessPermissions[`${membership.group_id}`] = membership.role;
    });

    return accessPermissions;
};