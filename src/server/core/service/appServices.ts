import { LayoutFormatter } from "./services/layoutFormatter";
import { ContextApi } from "@/src/server/core/service/api/contextApi";

export class AppServices {
  public readonly api: ContextApi;
  public readonly layout: LayoutFormatter;
  constructor() {
    this.api = new ContextApi();
    this.layout = new LayoutFormatter();
  }
}
