import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupsAndMembershipsSchemaType } from "@/src/schemas/syncPermissionsSchema";
import { EventsPages } from "../slices/EventsSlice";
import { GroupsSchemaType } from "@/src/schemas/groupSchema";
import { CategoriesSchemaType } from "@/src/schemas/categoriesSchema";

export type DomainStateType = {
    events: EventsPages,
    groups: GroupsSchemaType,
    categories: CategoriesSchemaType
};


async function getDomains(): Promise<GroupsAndMembershipsSchemaType> {
    const events = await trpcClient.events.list.mutate();
    const groups = await trpcClient.groups.list.mutate();
    const categories = await trpcClient.categories.getAllCategories.mutate();

    return {
        events,
        groups,
        categories
    }
};

async function syncDomains(): Promise<DomainStateType> {
    const {
        groups,
        events,
        categories
    } = await getDomains();


    return {
        events,
        groups,
        categories
    }
};

export { syncDomains };