import { GeoapifyConfig } from "../../lib/init/geoApifyConfig";
import {
  IGeoApifySearch,
  AddressSuggestion,
  LocationType,
  SuggestAddressesResults,
} from "./types";
import {
  GeoApifyQueryComposer,
  IGeoApifyQueryComposer,
} from "./geoApify/queryComposer";
import {
  AddressSuggestionParser,
  IAddressSuggestionParser,
} from "./geoApify/addressSuggestionParser";

export class GeoApifySearch implements IGeoApifySearch {
  private readonly apiKey: GeoapifyConfig["geoApifyKey"];
  private readonly geoapifyUrl: GeoapifyConfig["geoApifyUrl"];
  private readonly composer: IGeoApifyQueryComposer;
  private readonly parser: IAddressSuggestionParser;
  constructor(private readonly config: GeoapifyConfig) {
    this.apiKey = this.config.geoApifyKey;
    this.geoapifyUrl = this.config.geoApifyUrl;
    this.parser = new AddressSuggestionParser();
    this.composer = new GeoApifyQueryComposer(this.geoapifyUrl, this.apiKey);
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
    const query = this.composer.formQuery(address, locationKind);
    return await this.queryGeoApify(query);
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

    const parsed = this.parser.parse(result);

    return {
      status: "success",
      data: parsed,
    };
  }
}
