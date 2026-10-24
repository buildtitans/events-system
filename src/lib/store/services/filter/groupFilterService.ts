import type { TrpcClientType } from "@/src/trpc/trpcClient";
import type { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

interface IGroupFilterService {
  filter(args: GroupFilterArgs): Promise<GroupDiscoverySummarySchemaType[]>;
}

export type GroupFilterArgs =
  | { filter: "popular" }
  | { filter: "all" }
  | { filter: "category"; categoryId: CategorySchemaType["id"] };

export class GroupFilterService implements IGroupFilterService {
  constructor(private readonly trpc: TrpcClientType) {}

  public async filter(args: GroupFilterArgs): Promise<GroupDiscoverySummarySchemaType[]> {
    switch (args.filter) {
      case "all": {
        return await this.noFilter();
      }
      case "popular": {
        return await this.filterPopular();
      }
      case "category": {
        return await this.byCategory(args.categoryId);
      }

      default: {
        return assertNever(args);
      }
    }
  }

  private async noFilter(): Promise<GroupDiscoverySummarySchemaType[]> {
    return await this.trpc.hydrate.groups.list.all.query();
  }

  private async filterPopular(): Promise<GroupDiscoverySummarySchemaType[]> {
    return await this.trpc.hydrate.groups.list.popular.query();
  }

  private async byCategory(
    category: CategorySchemaType["name"],
  ): Promise<GroupDiscoverySummarySchemaType[]> {
    return await this.trpc.hydrate.groups.list.fromCategory.query(category);
  }
}
