import { DBClient } from "../db";
import { ParticipationsClient } from "./clients/participationsClient";
import { CensusClient } from "./clients/censusClient";
import { UserClient } from "./clients/userClient";

export class ServiceClient {
  public readonly participationsClient: ParticipationsClient;
  public readonly censusClient: CensusClient;
  public readonly userClient: UserClient;
  constructor(private api: DBClient) {
    this.participationsClient = new ParticipationsClient(this.api);
    this.censusClient = new CensusClient(this.api);
    this.userClient = new UserClient(this.api);
  }
}
