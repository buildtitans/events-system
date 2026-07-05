import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { EventAttendantsValidator } from "./eventAttendantsValidator";
import { EventAttendantsReader } from "./eventAttendantsReader";
dayjs.extend(utc);

export class EventAttendantsSelector {
  constructor(
    private readonly validator: EventAttendantsValidator,
    private readonly read: EventAttendantsReader,
  ) {}

  async allRecords(): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.read.allRawRecords();
    return this.validator.parseRawAttendants(raw);
  }

  async userRecords(user_id: string): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.read.userRecords(user_id);
    return this.validator.parseRawAttendants(raw);
  }

  async rsvp(
    user_id: string,
    event_id: string,
  ): Promise<EventAttendantsSchemaType["status"]> {
    const raw = await this.read.rawRsvp(user_id, event_id);
    const status = raw?.status ? raw.status : "not_going";
    return this.validator.parseRsvpStatusResult(status);
  }

  async pastRecords(ids: string[]): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.read.rawPastRecords(ids);
    return this.validator.parseRawAttendants(raw);
  }

  async attendant(
    user_id: string,
    event_id: string,
  ): Promise<EventAttendantsSchemaType> {
    const raw = await this.read.rawAttendant(user_id, event_id);
    return this.validator.parseRawAttendant(raw);
  }

  async attendants(event_id: string): Promise<EventAttendantsSchemaType[]> {
    const raw = await this.read.allRawAttendants(event_id);
    return this.validator.parseRawAttendants(raw);
  }
}
