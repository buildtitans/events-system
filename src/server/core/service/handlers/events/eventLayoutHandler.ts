import type {
  EventSchemaType,
  EventDiscoverySummarySchemaType,
  EventSurfaceSchemaType,
  GroupEventSummarySchemaType,
} from "@/src/schemas/events/eventSchema";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { EventLayoutComposer } from "./eventLayoutComposer";
import { IEventLayoutHandler, EventLayoutDb } from "./types";

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
    const events = await this.db.events.select.popular();
    const eventSurfaces = this.toEventDiscoverySurfaces(events);
    return this.composer.compileLayout(eventSurfaces);
  }

  async forGroup(groupId: string): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.byGroupId(groupId);
    const eventSurfaces = this.toGroupEventSurfaces(events);
    return this.compileFutureEvents(eventSurfaces);
  }

  async upcoming(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.upcoming();
    const eventSurfaces = this.toEventDiscoverySurfaces(events);
    return this.composer.compileLayout(eventSurfaces);
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
}
