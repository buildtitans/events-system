import type { EventsPages } from "../../store/slices/events/types";
import type { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";
import type { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";

type DomainStateType = {
  events: EventsPages;
  groups: GroupsSchemaType;
  categories: CategoriesSchemaType;
};

type SyncDomainsType =
  | {
      status: "fulfilled";
      data: DomainStateType;
    }
  | {
      status: "rejected";
      error: string;
    };

type Domains = keyof DomainStateType;

type DomainPromise<K extends keyof DomainStateType> = Promise<
  DomainStateType[K]
>;

type DomainPromises = { [K in keyof DomainStateType]: DomainPromise<K> };

type SyncResults = {
  [K in keyof DomainStateType]: PromiseSettledResult<DomainStateType[K]>;
};

export type {
  Domains,
  DomainPromise,
  DomainPromises,
  SyncResults,
  DomainStateType,
  SyncDomainsType,
};
