import { ViewerAccess } from "../slices/viewer/PermissionsSlice";
import { mapGroupAccessPermissions } from "../../tokens/accessPermissions";
import type { GroupsSchemaType } from "@/src/schemas/groupSchema";
import type { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

function handlePermissions(
    groups: GroupsSchemaType,
    memberships: GroupMembersSchemaType[] | null
) {
    const permissions = mapGroupAccessPermissions(groups, memberships);

    return permissions;
};

export async function syncPermissions(): Promise<ViewerAccess> {

    console.log("syncing permisssions")
    const groups = await trpcClient.groups.list.mutate();
    const memberships = await trpcClient.groupMembers.viewerMemberships.mutate();
    return handlePermissions(groups, memberships);
};