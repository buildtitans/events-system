import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  PaginatedLayoutSchema,
  LayoutSlotSchemaType,
  PaginatedLayoutSchemaType,
} from "@/src/schemas/events/layoutSlotSchema";
import { EventSurfaceSchemaType } from "@/src/schemas/events/eventSchema";
import { LayoutSlot } from "../../../lib/types";
import { cardSizingConfig } from "../../../lib/config/cardSizingConfig";
import { IEventLayoutComposer } from "./types";

export class EventLayoutComposer implements IEventLayoutComposer {
  constructor() {}

  public compileLayout(
    events: EventSurfaceSchemaType[],
  ): PaginatedLayoutSchemaType {
    const layout = this.buildLayoutSlots(events);
    return validateOrThrow(PaginatedLayoutSchema, layout);
  }

  private buildLayoutSlots(
    events: EventSurfaceSchemaType[],
  ): PaginatedLayoutSchemaType {
    const paginatedEvents = this.chunkEventsIntoPages(events);

    const paginatedLayoutSlots = [];

    for (const page of paginatedEvents) {
      const slots: LayoutSlotSchemaType[] = [];

      let i = 0;

      while (i < page.length) {
        const slot = this.designateLayoutSlot(i, page.length);

        if (slot.kind === "card") {
          slots.push({
            kind: "card",
            variant: slot.variant,
            event: page[i],
          });

          i += 1;
        } else {
          const remaining = page.length - i;
          const count = Math.min(slot.count, remaining);

          slots.push({
            kind: "stack",
            events: page.slice(i, i + count),
          });

          i += count;
        }
      }

      paginatedLayoutSlots.push(slots);
    }
    return paginatedLayoutSlots;
  }

  private chunkEventsIntoPages(
    events: EventSurfaceSchemaType[],
    maxPageLength: number = 6,
  ): EventSurfaceSchemaType[][] {
    const pages: EventSurfaceSchemaType[][] = [];

    for (let i = 0; i < events.length; i += maxPageLength) {
      pages.push(events.slice(i, i + maxPageLength));
    }
    return pages;
  }

  private designateLayoutSlot(index: number, pageLength: number): LayoutSlot {
    if (index === 3 && pageLength - index >= 2) {
      return { kind: "stack", count: 2 };
    }

    if (index === 2 || index === 5) {
      const cardSize = cardSizingConfig["thumbnail"];
      return {
        kind: "card",
        variant: {
          type: "thumbnail",
          size: cardSize,
        },
      };
    }

    return {
      kind: "card",
      variant: {
        type: "hero",
        size: cardSizingConfig["hero"],
      },
    };
  }
}
