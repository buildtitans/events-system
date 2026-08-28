import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { filterActiveEvents } from "@/src/server/core/lib/utils/filterActiveEvents";
import { EventLayoutComposer } from "./eventLayoutComposer";
import { IEventLayoutHandler, EventLayoutDb } from "./types";
import { curatePopularEventsIds } from "../../../lib/utils/curatePopularEventsIds";
import { filterActiveRecords } from "../../../lib/utils/filterActiveRecords";
const WINDOW = 30 * 24 * 60 * 60 * 1000;

export class EventLayoutHandler implements IEventLayoutHandler {
  constructor(
    private readonly db: EventLayoutDb,
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

  async popular(): Promise<PaginatedLayoutSchemaType> {
    const ids = await this.getPopularEventIds();
    return await this.byIds(ids);
  }

  async forGroup(groupId: string): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.byGroupId(groupId);
    return this.composer.compileLayout(filterActiveEvents(events));
  }

  async upcoming(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.allScheduled();
    const ids = this.extractUpcoming(events);
    return await this.byIds(ids);
  }

  private async getPopularEventIds() {
    const records = await this.db.eventAttendants.select.allRecords();
    const events = await this.db.events.select.allScheduled();
    const activeRecords = filterActiveRecords(events, records);
    return curatePopularEventsIds(activeRecords);
  }

  private extractUpcoming(events: EventSchemaType[]): EventSchemaType["id"][] {
    const results: EventSchemaType["id"][] = [];
    const nowMs = Date.now();

    for (const event of events) {
      const upcomingEvent = this.isUpcoming(event, nowMs);
      if (upcomingEvent) {
        results.push(event.id);
      }
    }
    return results;
  }

  private isUpcoming(event: EventSchemaType, nowMs: number): boolean {
    const windowEndMs = nowMs + WINDOW;
    const starts_at_ms = event.starts_at_ms;
    return starts_at_ms >= nowMs && starts_at_ms <= windowEndMs;
  }
}
