import { GeoapifyConfig } from "../../lib/init/geoApifyConfig";
import { GeoapifyAutocompleteValidator } from "../../lib/validation/schemaValidators";
import type { GeoapifyAutocompleteJsonResponse } from "@/src/schemas/geoapify/geoapifyAutocompleteSchema";
import {
  IGeoApifySearch,
  AddressSuggestion,
  LocationType,
  SuggestAddressesResults,
} from "./types";
import { GEOAPIFY_DEFAULT_URL_PARAMS } from "../../lib/config/geoApifyUrlParamsConfig";

export class GeoApifySearch implements IGeoApifySearch {
  private readonly apiKey: GeoapifyConfig["geoApifyKey"];
  private readonly geoapifyUrl: GeoapifyConfig["geoApifyUrl"];
  constructor(private readonly config: GeoapifyConfig) {
    this.apiKey = this.config.geoApifyKey;
    this.geoapifyUrl = this.config.geoApifyUrl;
  }

  public async suggestAddresses(
    address: string,
    locationKind: LocationType = "street",
  ): Promise<
    | {
        status: "success";
        data: AddressSuggestion[];
      }
    | {
        status: "failed";
        message: string;
      }
  > {
    const query = this.formQuery(address, locationKind);
    return await this.queryGeoApify(query);
  }

  private getBaselineParameters(): URL {
    const url = new URL(this.geoapifyUrl);

    url.searchParams.set("filter", GEOAPIFY_DEFAULT_URL_PARAMS.filter);
    url.searchParams.set("limit", GEOAPIFY_DEFAULT_URL_PARAMS.limit);
    url.searchParams.set("lang", GEOAPIFY_DEFAULT_URL_PARAMS.lang);
    url.searchParams.set("format", GEOAPIFY_DEFAULT_URL_PARAMS.format);
    return url;
  }

  private formQuery(
    address: string,
    locationKind: LocationType = "street",
  ): string {
    const url = this.getBaselineParameters();
    url.searchParams.set("text", address);
    url.searchParams.set("type", locationKind);
    url.searchParams.set("apiKey", this.apiKey);

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
