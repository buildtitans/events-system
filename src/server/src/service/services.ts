import { LayoutFormatter } from "./services/layoutFormatter";
import { ContextApi } from "./contextApi";

export class Services {
  public readonly api: ContextApi;
  public readonly layout: LayoutFormatter;
  constructor() {
    this.api = new ContextApi();
    this.layout = new LayoutFormatter();
  }
}
