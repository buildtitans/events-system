import type { EventsPages } from "@/src/lib/store/slices/events/EventsSlice";
import type { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import type { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";

type DomainStateType = {
    events: EventsPages,
    groups: GroupsSchemaType,
    categories: CategoriesSchemaType
};

type SyncDomainsResult = {
    status: "fulfilled" | "rejected",
    data: DomainStateType
}

type Domains = keyof DomainStateType;

type DomainPromise<K extends keyof DomainStateType> = Promise<DomainStateType[K]>;

type DomainPromises = { [K in keyof DomainStateType]: DomainPromise<K> };

type SyncResults = { [K in keyof DomainStateType]: PromiseSettledResult<DomainStateType[K]> };


export type {
    Domains,
    DomainPromise,
    DomainPromises,
    SyncResults,
    SyncDomainsResult,
    DomainStateType
};