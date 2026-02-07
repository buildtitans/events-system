import { mapGroupAccessPermissions } from "../../tokens/accessPermissions";
import { trpcClient } from "@/src/trpc/trpcClient";
import type { ViewerAccess } from "../slices/GroupMembersSlice";
import { GroupsAndMembershipsSchemaType } from "@/src/schemas/syncPermissionsSchema";
import { EventsPages } from "../slices/EventsSlice";
import { GroupsSchemaType } from "@/src/schemas/groupSchema";
import { CategoriesSchemaType } from "@/src/schemas/categoriesSchema";

export type DomainStateType = {
    events: EventsPages,
    groups: GroupsSchemaType,
    access: ViewerAccess,
    categories: CategoriesSchemaType
};


async function getDomains(): Promise<GroupsAndMembershipsSchemaType> {
    const events = await trpcClient.events.list.mutate();
    const groups = await trpcClient.groups.list.mutate();
    const memberships = await trpcClient.groupMembers.viewerMemberships.mutate();
    const categories = await trpcClient.categories.getAllCategories.mutate();

    return {
        events,
        groups,
        memberships,
        categories
    }
};

async function syncDomains(): Promise<DomainStateType> {
    const {
        groups,
        memberships,
        events,
        categories
    } = await getDomains();

    const access = mapGroupAccessPermissions(groups, memberships);

    return {
        events,
        groups,
        access,
        categories
    }
};

export { syncDomains };