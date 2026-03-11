import { DBClient } from "../db";
import { ParticipationsClient } from "./clients/participationsClient";
import { CensusClient } from "./clients/censusClient";
import { UserClient } from "./clients/userClient";
import { LayoutFormatter } from "./clients/layoutFormatter";

export class ServiceClient {
  public readonly participationsClient: ParticipationsClient;
  public readonly censusClient: CensusClient;
  public readonly userClient: UserClient;
  public readonly formatLayout: LayoutFormatter;
  constructor(private api: DBClient) {
    this.participationsClient = new ParticipationsClient(this.api);
    this.censusClient = new CensusClient(this.api);
    this.userClient = new UserClient(this.api);
    this.formatLayout = new LayoutFormatter();
  }
}
