import { ApplicationServices } from "./applicationServices";
import { Integrations } from "./integrations";
import { IIntegrationsAPI } from "./integrations/types";
import { IApplicationServices } from "./types";

export interface IApplicationAPI {
  readonly services: IApplicationServices;
  readonly integrations: IIntegrationsAPI;
}

export class ApplicationAPI implements IApplicationAPI {
  public readonly services: IApplicationServices;
  public readonly integrations: IIntegrationsAPI;
  constructor() {
    this.services = new ApplicationServices();
    this.integrations = new Integrations();
  }
}
