import { IAuthorization } from "@/src/server/core/service/auth/authorization";
import { CensusHandler } from "../handlers/participations/censusHandler";
import { ParticipationDtoHandler } from "../handlers/participations/participationDtoHandler";
import { RsvpHandler } from "../handlers/participations/rsvpHandler";
import { ICensusHandler, IRsvpHandler } from "../handlers/participations/types";
import type { ParticipationsServiceDb } from "@/src/server/core/service/services/types";

export class ParticipationsService {
  public readonly census: ICensusHandler;
  public readonly rsvps: IRsvpHandler;
  constructor(
    private readonly db: ParticipationsServiceDb,
    private readonly policy: IAuthorization,
  ) {
    this.census = new CensusHandler(this.db);
    this.rsvps = new RsvpHandler(
      this.db,
      this.policy,
      new ParticipationDtoHandler(),
    );
  }
}
