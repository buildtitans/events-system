import { trpcClient } from "@/src/trpc/trpcClient";
import type { AddressSearchResults } from "@/src/lib/hooks/search/types";

export async function searchByAddressKind(
  searchKind: "city" | "street",
  query: string,
): Promise<AddressSearchResults> {
  switch (searchKind) {
    case "city": {
      return await trpcClient.discovery.locations.cities.query(query);
    }
    case "street": {
      return await trpcClient.discovery.locations.addresses.query(query);
    }
  }
}
