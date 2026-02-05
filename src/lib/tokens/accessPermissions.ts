import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema"
import type { ViewerAccess } from "../store/slices/GroupMembersSlice";
import { GroupsSchemaType } from "@/src/schemas/groupSchema";

export const mapGroupAccessPermissions = (
    memberships: GroupMembersSchemaType[] | null,
    groups: GroupsSchemaType
): ViewerAccess => {
    const accessPermissions: ViewerAccess = {};

    groups.forEach((group) => {
        accessPermissions[`${group.id}`] = "anonymous";
    });

    memberships?.forEach((membership) => {
        accessPermissions[`${membership.group_id}`] = membership.role;
    });

    return accessPermissions;
};