import { trpcClient } from "@/src/trpc/trpcClient";
import {
  SyncDomainsType,
  SyncResults,
  DomainStateType,
} from "@/src/lib/types/server/types";
import { assertNever } from "../../utils/assert/assertNever";

export class SyncDomainsService {
  constructor(private readonly client: typeof trpcClient) {}

  async sync(): Promise<SyncDomainsType> {
    const results = await this.runSync();
    return this.handleResults(results);
  }

  private async runSync(): Promise<SyncResults> {
    const [events, groups, categories, groupNameDictionary] =
      await Promise.allSettled([
        this.client.events.layout.allActive.mutate(),
        this.client.groups.list.mutate(),
        this.client.categories.getAllCategories.mutate(),
        this.client.groups.nameLookup.mutate(),
      ]);

    return {
      events,
      groups,
      categories,
      groupNameDictionary,
    } satisfies SyncResults;
  }

  private handleResults(results: SyncResults): SyncDomainsType {
    const allRejected = Object.values(results).every(
      (result) => result.status === "rejected",
    );

    if (allRejected) {
      return this.createFailedResult();
    }

    return this.mapResults(results);
  }

  private mapResults(results: SyncResults): SyncDomainsType {
    return {
      status: "fulfilled",
      data: {
        events: this.valueOrFallback(results.events, []),
        groups: this.valueOrFallback(results.groups, []),
        categories: this.valueOrFallback(results.categories, []),
        groupNameDictionary: this.valueOrFallback(
          results.groupNameDictionary,
          {},
        ),
      } satisfies DomainStateType,
    };
  }

  private valueOrFallback<T>(result: PromiseSettledResult<T>, fallback: T): T {
    switch (result.status) {
      case "rejected": {
        return fallback;
      }
      case "fulfilled": {
        return result.value;
      }

      default: {
        return assertNever(result);
      }
    }
  }

  private createFailedResult(): Extract<
    SyncDomainsType,
    { status: "rejected" }
  > {
    return {
      status: "rejected",
      error: "Domain init failed",
    };
  }
}
