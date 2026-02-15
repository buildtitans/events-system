import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupsAndMembershipsSchemaType } from "@/src/schemas/permissions/syncPermissionsSchema";
import { EventsPages } from "../slices/events/EventsSlice";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";

export type DomainStateType = {
    events: EventsPages,
    groups: GroupsSchemaType,
    categories: CategoriesSchemaType
};

async function getDomains(): Promise<GroupsAndMembershipsSchemaType | null | undefined> {

    const [eventsRes, groupsRes, categoriesRes] = await Promise.allSettled([
        trpcClient.events.list.mutate(),
        trpcClient.groups.list.mutate(),
        trpcClient.categories.getAllCategories.mutate(),
    ])

    return {
        events: eventsRes.status === "fulfilled" ? eventsRes.value : [],
        groups: groupsRes.status === "fulfilled" ? groupsRes.value : [],
        categories: categoriesRes.status === "fulfilled" ? categoriesRes.value : []
    }

};

async function syncDomains(): Promise<DomainStateType> {
    const result = await getDomains();

    return result
        ? {
            events: result.events,
            groups: result.groups,
            categories: result.categories
        }

        : {
            events: [],
            groups: [],
            categories: []
        }
};

export { syncDomains };