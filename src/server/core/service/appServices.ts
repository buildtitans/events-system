import { ContextApi } from "@/src/server/core/service/api/contextApi";
import { Integrations } from "./integrations/integrations";
import { IntegrationsAPI } from "./integrations/types";

export class AppServices {
  public readonly api: ContextApi;
  public readonly integrations: IntegrationsAPI;
  constructor() {
    this.api = new ContextApi();
    this.integrations = new Integrations();
  }
}
