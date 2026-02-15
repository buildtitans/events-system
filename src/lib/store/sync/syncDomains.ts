import { trpcClient } from "@/src/trpc/trpcClient";
import { EventsPages } from "../slices/events/EventsSlice";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";

export type DomainStateType = {
    events: EventsPages,
    groups: GroupsSchemaType,
    categories: CategoriesSchemaType
};

//export type SyncDomainsResult = {
//    status: "fulfilled" | "rejected",
//    data: DomainStateType
//}

async function syncDomains(): Promise<DomainStateType> {
    const [eventsRes, groupsRes, categoriesRes] = await Promise.allSettled([
        trpcClient.events.list.mutate(),
        trpcClient.groups.list.mutate(),
        trpcClient.categories.getAllCategories.mutate(),
    ]);

    return {
        events: eventsRes.status === "fulfilled" ? eventsRes.value : [],
        groups: groupsRes.status === "fulfilled" ? groupsRes.value : [],
        categories: categoriesRes.status === "fulfilled" ? categoriesRes.value : []
    };
};

export { syncDomains };