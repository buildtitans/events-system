import { ContextApi } from "@/src/server/core/service/api/contextApi";
import { Integrations } from "./integrations/integrations";

export class AppServices {
  public readonly api: ContextApi;
  public readonly integrations: Integrations;
  constructor() {
    this.api = new ContextApi();
    this.integrations = new Integrations();
  }
}
