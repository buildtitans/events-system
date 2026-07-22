import { GeoApifySearch } from "@/src/server/core/service/integrations/geoApifySearch";
import { geoApifyConfig } from "@/src/server/core/lib/init/geoApifyConfig";
import { IGeoApifySearch, IntegrationsAPI } from "./types";

export class Integrations implements IntegrationsAPI {
  public readonly geoApify: IGeoApifySearch;
  constructor() {
    this.geoApify = new GeoApifySearch(geoApifyConfig);
  }
}
