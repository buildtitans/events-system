import { GeoApifySearch } from "@/src/server/core/service/integrations/geoApifySearch";
import { geoApifyConfig } from "@/src/server/core/lib/init/geoApifyConfig";

export class Integrations {
  public readonly geoApify: GeoApifySearch;
  constructor() {
    this.geoApify = new GeoApifySearch(geoApifyConfig);
  }
}
