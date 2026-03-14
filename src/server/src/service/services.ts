import { LayoutFormatter } from "./services/layoutFormatter";
import { ServiceApi } from "./serviceApi";

export class Services {
  public readonly api: ServiceApi;
  public readonly layout: LayoutFormatter;
  constructor() {
    this.api = new ServiceApi();
    this.layout = new LayoutFormatter();
  }
}
