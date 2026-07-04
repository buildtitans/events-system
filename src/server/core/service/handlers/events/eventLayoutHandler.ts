import { EventSchemaType } from "../../../../../schemas/events/eventSchema";
import { PaginatedLayoutSchemaType } from "../../../../../schemas/events/layoutSlotSchema";
import { DBClient } from "../../../db";
import { filterActiveEvents } from "../../../lib/utils/filterActiveEvents";
import { EventLayoutComposer } from "./eventLayoutComposer";

export class EventLayoutHandler {
  constructor(
    private readonly db: DBClient,
    private readonly composer: EventLayoutComposer,
  ) {}

  async byIds(
    ids: EventSchemaType["id"][],
  ): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.byIds(ids);
    return this.composer.compileLayout(events);
  }

  async all(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.allEvents();
    return this.composer.compileLayout(events);
  }

  async active(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.allScheduled();
    return this.composer.compileLayout(filterActiveEvents(events));
  }

  async forGroup(groupId: string): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.byGroupId(groupId);
    return this.composer.compileLayout(filterActiveEvents(events));
  }
}
