import { trpcClient } from "@/src/trpc/trpcClient";
import type {
  Domains,
  DomainPromises,
  SyncResults,
  SyncDomainsResult,
  DomainStateType,
} from "@/src/lib/types/server/types";

const createDomainStateFallback = (): DomainStateType => ({
  events: [],
  activeEvents: [],
  groups: [],
  categories: [],
  groupNameDictionary: {},
});

async function syncDomains(): Promise<SyncDomainsResult> {
  const requests = await runSync();
  const results = handleResults(requests);
  return results;
}

async function runSync(): Promise<SyncResults> {
  const map = {
    events: trpcClient.events.allEventsLayout.mutate(),
    activeEvents: trpcClient.events.allActiveEventsLayout.mutate(),
    groups: trpcClient.groups.list.mutate(),
    categories: trpcClient.categories.getAllCategories.mutate(),
    groupNameDictionary: trpcClient.groups.nameLookup.mutate(),
  } satisfies DomainPromises;
  const keys = Object.keys(map) as Domains[];
  const promises = await Promise.allSettled(Object.values(map));

  return Object.fromEntries(
    promises.map((res, i) => [keys[i], res]),
  ) as SyncResults;
}

function handleResults(results: SyncResults): SyncDomainsResult {
  const allRejected = Object.values(results).every(
    (result) => result.status === "rejected",
  );

  if (allRejected) {
    return {
      status: "rejected",
      data: createDomainStateFallback(),
    };
  }

  return {
    status: "fulfilled",
    data: {
      events: results.events.status === "fulfilled" ? results.events.value : [],
      activeEvents:
        results.activeEvents.status === "fulfilled"
          ? results.activeEvents.value
          : [],
      groups: results.groups.status === "fulfilled" ? results.groups.value : [],
      categories:
        results.categories.status === "fulfilled"
          ? results.categories.value
          : [],
      groupNameDictionary:
        results.groupNameDictionary.status === "fulfilled"
          ? results.groupNameDictionary.value
          : {},
    } as DomainStateType,
  };
}

export { syncDomains };
