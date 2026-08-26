import { GEOAPIFY_DEFAULT_URL_PARAMS } from "../../../lib/config/geoApifyUrlParamsConfig";
import { LocationType } from "../types";

export interface IGeoApifyQueryComposer {
  formQuery(address: string, locationKind?: LocationType): string;
}

export class GeoApifyQueryComposer implements IGeoApifyQueryComposer {
  constructor(
    private readonly geoapifyUrl: string,
    private readonly apiKey: string,
  ) {}

  public formQuery(
    address: string,
    locationKind: LocationType = "street",
  ): string {
    const url = this.getBaselineParameters();
    url.searchParams.set("text", address);
    url.searchParams.set("type", locationKind);
    url.searchParams.set("apiKey", this.apiKey);

    return url.toString();
  }

  private getBaselineParameters(): URL {
    const url = new URL(this.geoapifyUrl);

    url.searchParams.set("filter", GEOAPIFY_DEFAULT_URL_PARAMS.filter);
    url.searchParams.set("limit", GEOAPIFY_DEFAULT_URL_PARAMS.limit);
    url.searchParams.set("lang", GEOAPIFY_DEFAULT_URL_PARAMS.lang);
    url.searchParams.set("format", GEOAPIFY_DEFAULT_URL_PARAMS.format);
    return url;
  }
}
