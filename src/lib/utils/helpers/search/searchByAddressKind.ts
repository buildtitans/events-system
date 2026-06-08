import { trpcClient } from "@/src/trpc/trpcClient";
import type { SearchResults } from "@/src/lib/hooks/search/types";

export async function searchByAddressKind(
  searchKind: "city" | "street",
  query: string,
): Promise<SearchResults> {
  switch (searchKind) {
    case "city": {
      return await trpcClient.addressSearch.citySearchSuggestions.mutate(query);
    }
    case "street": {
      return await trpcClient.addressSearch.addressSuggestions.mutate(query);
    }
  }
}
