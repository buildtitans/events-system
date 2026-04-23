import { GeoApifyAddressSearch } from "./geoApifyService";

export class Integrations {
  public readonly geoApify: GeoApifyAddressSearch;
  constructor() {
    this.geoApify = new GeoApifyAddressSearch();
  }
}
