import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { DBClient } from "@/src/server/core/db";
import { filterActiveEvents } from "@/src/server/core/lib/utils/filterActiveEvents";
import { EventLayoutComposer } from "./eventLayoutComposer";
import { IEventLayoutHandler } from "./types";

export class EventLayoutHandler implements IEventLayoutHandler {
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
    const events = await this.db.events.select.allStatuses();
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
