import type { EventsPages } from "../../store/slices/events/types";
import type {
  GroupsSchemaType,
  GroupSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { CategoriesSchemaType } from "@/src/schemas/groups/categoriesSchema";

export type NameSlugDescriptionLookup = Record<
  GroupSchemaType["id"],
  {
    name: GroupSchemaType["name"];
    slug: GroupSchemaType["slug"];
    group_description: GroupSchemaType["description"];
  }
>;

type DomainStateType = {
  events: EventsPages;
  activeEvents: EventsPages;
  groups: GroupsSchemaType;
  categories: CategoriesSchemaType;
  groupNameDictionary: NameSlugDescriptionLookup;
};

type SyncDomainsResult = {
  status: "fulfilled" | "rejected";
  data: DomainStateType;
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
  SyncDomainsResult,
  DomainStateType,
};
