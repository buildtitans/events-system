import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { EventAttendantsValidator } from "./eventAttendantsValidator";
import { AuthenticatedUserId } from "../../../../service/handlers/session/SessionHandler";
import { RsvpSurfaceSchemaType } from "../../../../../../schemas/events/rsvpSchema";
import { IEventAttendantsReader } from "./types";
dayjs.extend(utc);

export interface IEventAttendantsSelector {
  rsvps(user_id: AuthenticatedUserId): Promise<RsvpSurfaceSchemaType[]>;
  allRecords(): Promise<EventAttendantsSchemaType[]>;

  rsvp(
    user_id: string,
    event_id: string,
  ): Promise<EventAttendantsSchemaType["status"]>;
  attendant(
    user_id: string,
    event_id: string,
  ): Promise<EventAttendantsSchemaType>;
  attendants(event_id: string): Promise<EventAttendantsSchemaType[]>;
}

export class EventAttendantsSelector implements IEventAttendantsSelector {
  constructor(
    private readonly validator: EventAttendantsValidator,
    private readonly read: IEventAttendantsReader,
  ) {}

  async allRecords(): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.read.allRawRecords();
    return this.validator.parseRawAttendants(raw);
  }

  async rsvp(
    user_id: string,
    event_id: string,
  ): Promise<EventAttendantsSchemaType["status"]> {
    const raw = await this.read.rawRsvp({ user_id, event_id });
    const status = raw?.status ? raw.status : "not_going";
    return this.validator.parseRsvpStatusResult(status);
  }

  async rsvps(user_id: AuthenticatedUserId): Promise<RsvpSurfaceSchemaType[]> {
    const raw = await this.read.rsvps(user_id);
    return this.validator.parseRsvps(raw);
  }

  async attendant(
    user_id: string,
    event_id: string,
  ): Promise<EventAttendantsSchemaType> {
    const raw = await this.read.rawAttendant({ user_id, event_id });
    return this.validator.parseRawAttendant(raw);
  }

  async attendants(event_id: string): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.read.allRawAttendants(event_id);
    return this.validator.parseRawAttendants(raw);
  }
}
