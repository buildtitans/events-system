import type { TrpcClientType } from "@/src/trpc/trpcClient";
import type {
  SyncDomainsType,
  SyncResults,
  DomainStateType,
} from "@/src/lib/types/server/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

interface ISyncDomainsService {
  sync(): Promise<SyncDomainsType>;
}

export class SyncDomainsService implements ISyncDomainsService {
  constructor(private readonly client: TrpcClientType) {}

  async sync(): Promise<SyncDomainsType> {
    const results = await this.runSync();
    return this.handleResults(results);
  }

  private async runSync(): Promise<SyncResults> {
    const [events, groups, categories] =
      await Promise.allSettled([
        this.client.layouts.events.discovery.query(),
        this.client.groups.read.select.list.query(),
        this.client.categories.getAllCategories.query(),
      ]);

    return {
      events,
      groups,
      categories,
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
