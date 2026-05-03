import { getEnv } from "../../lib/init/getEnv";
import { GeoapifyAutocompleteValidator } from "../../lib/validation/schemaValidators";
import type { GeoapifyAutocompleteJsonResponse } from "@/src/schemas/geoapify/geoapifyAutocompleteSchema";

const geoApifyKey = getEnv("geoApifyKey");
const geoApifyUrl = getEnv("geoApifyUrl");

type AddressSuggestion = {
  label: string;
  sublabel: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
};

type LocationType =
  | "country"
  | "state"
  | "city"
  | "postcode"
  | "street"
  | "amenity"
  | "locality";

type SuggestAddressesResults = Promise<
  | { status: "success"; data: AddressSuggestion[] }
  | { status: "failed"; message: string }
>;

export class GeoApifyAddressSearch {
  constructor() {}

  public async suggestAddresses(
    address: string,
    locationKind: LocationType = "street",
  ) {
    const query = this.formQuery(address, locationKind);
    return await this.queryGeoApify(query);
  }

  private formQuery(address: string, locationKind: LocationType = "street") {
    const url = new URL(geoApifyUrl);
    url.searchParams.set("text", address);
    url.searchParams.set("type", locationKind);
    url.searchParams.set("filter", "countrycode:us");
    url.searchParams.set("limit", "10");
    url.searchParams.set("lang", "en");
    url.searchParams.set("format", "json");
    url.searchParams.set("apiKey", geoApifyKey);

    return url.toString();
  }

  private async queryGeoApify(query: string): SuggestAddressesResults {
    const request = await fetch(query, {
      method: "GET",
    });

    if (!request.ok) {
      return {
        status: "failed",
        message: `Failed to query Geoapify for addresses: 
        ${request.status} ${request.statusText}
        `,
      };
    }
    const result = await request.json();

    const parsed = GeoapifyAutocompleteValidator(result);

    return {
      status: "success",
      data: this.toSuggestions(parsed),
    };
  }

  private toSuggestions(
    data: GeoapifyAutocompleteJsonResponse,
  ): AddressSuggestion[] {
    return data.results.map((result) => ({
      label: result.formatted ?? "",
      sublabel: result.county ?? "",
      country: result.country ?? "",
      city: result.city ?? "",
      state: result.state ?? "",
      street: result.street ?? "",
    }));
  }
}
