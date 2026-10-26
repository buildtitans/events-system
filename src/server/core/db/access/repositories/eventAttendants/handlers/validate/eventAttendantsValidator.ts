import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  EventAttendantStatusSchema,
  EventAttendantsSchema,
  type EventAttendantsSchemaType,
} from "@/src/schemas/events/eventAttendantsSchema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  RsvpSurfaceSchemaType,
  RsvpSurfacesSchema,
  RsvpUpdateResponseSchema,
  RsvpUpdateResponseSchemaType,
} from "../../../../../../../../schemas/events/rsvpSchema";
import { AttendantShape } from "../parse/eventAttendantsParser";
dayjs.extend(utc);

export class EventAttendantsValidator {
  rsvp(data: unknown): RsvpUpdateResponseSchemaType {
    return validateOrThrow(RsvpUpdateResponseSchema, data);
  }

  rsvps(rsvps: unknown[]): RsvpSurfaceSchemaType[] {
    return validateOrThrow(RsvpSurfacesSchema, rsvps);
  }

  attendant(row: AttendantShape): EventAttendantsSchemaType {
    return validateOrThrow(EventAttendantsSchema, row);
  }

  rsvpStatus(status: unknown): EventAttendantsSchemaType["status"] {
    return validateOrThrow(EventAttendantStatusSchema, status);
  }
}
