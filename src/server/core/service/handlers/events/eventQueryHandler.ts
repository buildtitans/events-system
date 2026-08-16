import { IDBClient } from "@/src/server/core/db/access/client/dbClient";
import { SearchSchemaType } from "@/src/schemas/search/searchSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events//eventAttendantsSchema";
import { IEventQueryHandler } from "./types";
import { GroupSchemaType } from "../../../../../schemas/groups/groupSchema";

export class EventQueryHandler implements IEventQueryHandler {
  constructor(
    private readonly db: Pick<IDBClient, "events" | "eventAttendants">,
  ) {}

  async getAllEvents(): Promise<EventSchemaType[]> {
    return await this.db.events.select.allStatuses();
  }

  async allActive(): Promise<EventSchemaType[]> {
    return await this.db.events.select.allScheduled();
  }

  async searchEvents(query: SearchSchemaType): Promise<EventSchemaType[]> {
    return await this.db.events.select.search(query);
  }

  async getEventById(event_id: string): Promise<EventSchemaType> {
    return await this.db.events.select.byId(event_id);
  }

  async nextEventForGroup(
    group_id: GroupSchemaType["id"],
  ): Promise<EventSchemaType | undefined> {
    return await this.db.events.select.nextEventByGroupId(group_id);
  }

  async getEventAttendants(
    event_id: string,
  ): Promise<EventAttendantsSchemaType[]> {
    return await this.db.eventAttendants.select.attendants(event_id);
  }

  async getGroupEvents(group_id: string): Promise<EventSchemaType[]> {
    return await this.db.events.select.byGroupId(group_id);
  }
}
