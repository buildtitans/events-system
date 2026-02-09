import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema"
import type { ViewerAccess } from "../store/slices/viewer/PermissionsSlice";
import { GroupsSchemaType } from "@/src/schemas/groupSchema";

export const mapGroupAccessPermissions = (
    groups: GroupsSchemaType,
    memberships: GroupMembersSchemaType[] | null
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