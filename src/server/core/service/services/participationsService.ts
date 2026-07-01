import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";
import { CensusHandler } from "../handlers/participations/censusHandler";
import { ParticipationDtoHandler } from "../handlers/participations/participationDtoHandler";
import { RsvpHandler } from "../handlers/participations/rsvpHandler";

export class ParticipationsService {
  public readonly census: CensusHandler;
  public readonly rsvps: RsvpHandler;
  constructor(
    private readonly db: DBClient,
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
