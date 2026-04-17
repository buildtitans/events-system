import { ContextApi } from "@/src/server/core/service/api/contextApi";

export class AppServices {
  public readonly api: ContextApi;
  constructor() {
    this.api = new ContextApi();
  }
}
