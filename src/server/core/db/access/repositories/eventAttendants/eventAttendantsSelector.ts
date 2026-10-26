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
  rsvp(
    user_id: AuthenticatedUserId,
    event_id: string,
  ): Promise<EventAttendantsSchemaType["status"]>;
}

export class EventAttendantsSelector implements IEventAttendantsSelector {
  constructor(
    private readonly validator: EventAttendantsValidator,
    private readonly read: IEventAttendantsReader,
  ) {}

  async rsvp(
    user_id: AuthenticatedUserId,
    event_id: string,
  ): Promise<EventAttendantsSchemaType["status"]> {
    const raw = await this.read.rsvp({ user_id, event_id });
    const status = raw?.status ? raw.status : "not_going";
    return this.validator.rsvpStatus(status);
  }

  async rsvps(user_id: AuthenticatedUserId): Promise<RsvpSurfaceSchemaType[]> {
    const raw = await this.read.rsvps(user_id);
    return this.validator.parseRsvps(raw);
  }
}
