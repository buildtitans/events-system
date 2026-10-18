import { IAuthorization } from "@/src/server/core/service/auth/authorization";
import { CensusHandler } from "../handlers/participations/censusHandler";
import { RsvpHandler } from "../handlers/participations/rsvpHandler";
import { ICensusHandler, IRsvpHandler } from "../handlers/participations/types";
import type {
  IParticipationsService,
  ParticipationsServiceDb,
} from "@/src/server/core/service/services/types";

export class ParticipationsService implements IParticipationsService {
  public readonly census: ICensusHandler;
  public readonly attendance: IRsvpHandler;
  constructor(
    private readonly db: ParticipationsServiceDb,
    private readonly policy: IAuthorization,
  ) {
    this.census = new CensusHandler(this.db);
    this.attendance = new RsvpHandler(this.db, this.policy);
  }
}
