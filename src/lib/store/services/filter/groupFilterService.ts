import type { TrpcClientType } from "@/src/trpc/trpcClient";
import type { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

interface IGroupFilterService {
  filter(args: GroupFilterArgs): Promise<GroupSchemaType[]>;
}

export type GroupFilterArgs =
  | { filter: "popular" }
  | { filter: "all" }
  | { filter: "category"; categoryId: CategorySchemaType["id"] };

export class GroupFilterService implements IGroupFilterService {
  constructor(private readonly trpc: TrpcClientType) {}

  public async filter(args: GroupFilterArgs): Promise<GroupSchemaType[]> {
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

  private async noFilter(): Promise<GroupSchemaType[]> {
    return await this.trpc.groups.select.all.query();
  }

  private async filterPopular(): Promise<GroupSchemaType[]> {
    return await this.trpc.groups.select.popular.query();
  }

  private async byCategory(
    category: CategorySchemaType["name"],
  ): Promise<GroupSchemaType[]> {
    return await this.trpc.groups.select.byCategory.query(category);
  }
}
