import { DBClient } from "@/src/server/core/db/access/client/dbClient";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events//eventAttendantsSchema";

export class EventQueryHandler {
  constructor(private readonly db: DBClient) {}

  async getAllEvents(): Promise<EventsArraySchemaType> {
    return await this.db.events.getEvents();
  }

  async searchEvents(query: SearchSchemaType): Promise<EventsArraySchemaType> {
    return await this.db.events.searchEventByTitle(query);
  }

  async getEventById(event_id: string): Promise<EventSchemaType> {
    return await this.db.events.getEvent(event_id);
  }

  async getEventAttendants(
    event_id: string,
  ): Promise<EventAttendantsSchemaType[]> {
    return await this.db.eventAttendants.getAttendants(event_id);
  }

  async getGroupEvents(group_id: string): Promise<EventsArraySchemaType> {
    return await this.db.events.getGroupEvents(group_id);
  }
}
