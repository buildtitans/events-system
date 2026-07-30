import { IDBClient } from "@/src/server/core/db/access/client/dbClient";
import { Authorization } from "@/src/server/core/service/auth/authorization";
import { CensusHandler } from "../handlers/participations/censusHandler";
import { ParticipationDtoHandler } from "../handlers/participations/participationDtoHandler";
import { RsvpHandler } from "../handlers/participations/rsvpHandler";
import { ICensusHandler, IRsvpHandler } from "../handlers/participations/types";

export class ParticipationsService {
  public readonly census: ICensusHandler;
  public readonly rsvps: IRsvpHandler;
  constructor(
    private readonly db: IDBClient,
    private readonly policy: Authorization,
  ) {
    this.census = new CensusHandler(this.db);
    this.rsvps = new RsvpHandler(
      this.db,
      this.policy,
      new ParticipationDtoHandler(),
    );
  }
}
