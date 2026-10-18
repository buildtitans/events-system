import type {
  EventSchemaType,
  EventDiscoverySummarySchemaType,
  EventSurfaceSchemaType,
  GroupEventSummarySchemaType,
} from "@/src/schemas/events/eventSchema";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
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

  async discovery(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.discovery();
    const eventSurfaces = this.toEventDiscoverySurfaces(events);
    return this.compileFutureEvents(eventSurfaces);
  }

  async byIds(
    ids: EventSchemaType["id"][],
  ): Promise<PaginatedLayoutSchemaType> {
    if (ids.length === 0) return [];
    const events = await this.db.events.select.byIds(ids);
    const eventSurfaces = this.toEventDiscoverySurfaces(events);
    return this.composer.compileLayout(eventSurfaces);
  }

  async popular(): Promise<PaginatedLayoutSchemaType> {
    const ids = await this.getPopularEventIds();
    return await this.byIds(ids);
  }

  async forGroup(groupId: string): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.byGroupId(groupId);
    const eventSurfaces = this.toGroupEventSurfaces(events);
    return this.compileFutureEvents(eventSurfaces);
  }

  async upcoming(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.allScheduled();
    const ids = this.extractUpcoming(events);
    return await this.byIds(ids);
  }

  private toEventDiscoverySurfaces(
    events: EventDiscoverySummarySchemaType[],
  ): Extract<EventSurfaceSchemaType, { for: "discovery" }>[] {
    return events.map((content) => ({
      for: "discovery",
      content,
    }));
  }

  private toGroupEventSurfaces(
    events: GroupEventSummarySchemaType[],
  ): Extract<EventSurfaceSchemaType, { for: "withinGroup" }>[] {
    return events.map((content) => ({
      for: "withinGroup",
      content,
    }));
  }

  private compileFutureEvents(events: EventSurfaceSchemaType[]) {
    const now = Date.now();
    const upcoming = events
      .filter(({ content: { event } }) => event.starts_at_ms > now)
      .sort(
        (a, b) => a.content.event.starts_at_ms - b.content.event.starts_at_ms,
      );
    return this.composer.compileLayout(upcoming);
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
