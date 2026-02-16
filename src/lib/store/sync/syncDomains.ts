import { trpcClient } from "@/src/trpc/trpcClient";
import { EventsPages } from "../slices/events/EventsSlice";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";

type PromiseAllSettledResult<T> = PromiseFulfilledResult<T> | PromiseRejectedResult;

export type DomainStateType = {
    events: EventsPages,
    groups: GroupsSchemaType,
    categories: CategoriesSchemaType
};

export type SyncDomainsResult = {
    status: "fulfilled" | "rejected",
    data: DomainStateType
}

type Domains = "events" | "groups" | "categories";

type DomainPromises = Record<Domains, Promise<unknown>>;


async function runSync(): Promise<Record<Domains, PromiseSettledResult<unknown>>> {

    const map = {
        events: trpcClient.events.list.mutate(),
        groups: trpcClient.groups.list.mutate(),
        categories: trpcClient.categories.getAllCategories.mutate(),
    } satisfies DomainPromises;

    const keys = Object.keys(map) as Domains[];

    const promises = await Promise.allSettled(Object.values(map));

    return Object.fromEntries(promises.map((res, i) => [keys[i], res])) as Record<Domains, PromiseSettledResult<unknown>>;
};


async function syncDomains(): Promise<SyncDomainsResult> {

    const requests = await runSync();

    const results = handleResults(requests);

    return results


};


function handleResults(results: Record<Domains, PromiseAllSettledResult<unknown>>): SyncDomainsResult {

    const allRejected = Object.values(results).every((result) => result.status === "rejected");


    if (allRejected) {
        return {
            status: "rejected",
            data: {
                events: [],
                groups: [],
                categories: []
            }
        }
    }
    return {
        status: "fulfilled",
        data: {
            events: results.events.status === "fulfilled" ? results.events.value : [],
            groups: results.groups.status === "fulfilled" ? results.groups.value : [],
            categories: results.categories.status === "fulfilled" ? results.categories.value : []
        } as DomainStateType
    }
}

export { syncDomains };