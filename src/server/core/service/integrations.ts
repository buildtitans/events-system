import { GeoApifySearch } from "@/src/server/core/service/integrations/geoApifySearch";
import { geoApifyConfig } from "@/src/server/core/lib/init/geoApifyConfig";
import { IGeoApifySearch, IIntegrationsAPI } from "./integrations/types";

export class Integrations implements IIntegrationsAPI {
  public readonly geoApify: IGeoApifySearch;
  constructor() {
    this.geoApify = new GeoApifySearch(geoApifyConfig);
  }
}
