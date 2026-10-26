import type {
  EventDiscoverySummarySchemaType,
  EventSurfaceSchemaType,
  GroupEventSummarySchemaType,
} from "@/src/schemas/events/eventSchema";
import { PaginatedLayoutSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { EventLayoutComposer } from "./eventLayoutComposer";
import { IEventLayoutHandler, EventLayoutDb } from "./types";
import { GroupSchemaType } from "../../../../../schemas/groups/groupSchema";

export class EventLayoutHandler implements IEventLayoutHandler {
  constructor(
    private readonly db: EventLayoutDb,
    private readonly composer: EventLayoutComposer,
  ) {}

  async discovery(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.view.list.discovery();
    const eventSurfaces = this.toEventDiscoverySurfaces(events);
    return this.composer.compileLayout(eventSurfaces);
  }

  async popular(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.view.list.popular();
    const eventSurfaces = this.toEventDiscoverySurfaces(events);
    return this.composer.compileLayout(eventSurfaces);
  }

  async upcoming(): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.view.list.upcoming();
    const eventSurfaces = this.toEventDiscoverySurfaces(events);
    return this.composer.compileLayout(eventSurfaces);
  }

  async forGroup(
    id: GroupSchemaType["id"],
  ): Promise<PaginatedLayoutSchemaType> {
    const events = await this.db.events.select.view.list.forGroup(id);
    const surfaces = this.toGroupEventSurfaces(events);
    return this.composer.compileLayout(surfaces);
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
}
