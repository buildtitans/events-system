import {
  ContextApi,
  IContextApi,
} from "@/src/server/core/service/api/contextApi";
import { Integrations } from "./integrations/integrations";
import { IntegrationsAPI } from "./integrations/types";

export interface IAppServices {
  readonly api: IContextApi;
  readonly integrations: IntegrationsAPI;
}

export class AppServices implements IAppServices {
  public readonly api: IContextApi;
  public readonly integrations: IntegrationsAPI;
  constructor() {
    this.api = new ContextApi();
    this.integrations = new Integrations();
  }
}
