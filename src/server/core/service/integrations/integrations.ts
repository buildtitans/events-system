import { GeoApifyAddressSearch } from "./geoApifyAddressSearch";

export class Integrations {
  public readonly geoApify: GeoApifyAddressSearch;
  constructor() {
    this.geoApify = new GeoApifyAddressSearch();
  }
}
