import { GroupFilterService } from "@/src/lib/store/services/filter/groupFilterService";
import type { GroupDiscoverySummarySchemaType } from "@/src/schemas/groups/groupSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

describe("GroupFilterService.filter", () => {
  it("gets groups using the selected category id", async () => {
    const categoryId = "category-1";
    const groups: GroupDiscoverySummarySchemaType[] = [];
    const byCategory = jest.fn().mockResolvedValue(groups);
    const trpc = {
      hydrate: {
        groups: {
          list: {
            fromCategory: { query: byCategory },
          },
        },
      },
    } as unknown as TrpcClientType;
    const service = new GroupFilterService(trpc);

    await expect(
      service.filter({ filter: "category", categoryId }),
    ).resolves.toBe(groups);

    expect(byCategory).toHaveBeenCalledTimes(1);
    expect(byCategory).toHaveBeenCalledWith(categoryId);
  });
});
