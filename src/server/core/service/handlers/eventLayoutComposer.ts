import { layoutSlotValidator } from "@/src/server/core/lib/validation/schemaValidators";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";
import {
  LayoutSlotSchemaType,
  PaginatedLayoutSchemaType,
} from "@/src/schemas/events/layoutSlotSchema";
import { CardDesignation, CardType, LayoutSlot } from "../../lib/types";

export class EventLayoutComposer {
  constructor() {}

  public compileLayout(events: EventSchemaType[]): PaginatedLayoutSchemaType {
    const layout = this.buildLayoutSlots(events);
    return layoutSlotValidator(layout);
  }

  private buildLayoutSlots(
    events: EventSchemaType[],
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
    events: EventsArraySchemaType,
    maxPageLength: number = 6,
  ): EventsArraySchemaType[] {
    const pages: EventsArraySchemaType[] = [];

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
      const cardSize = this.getCardSizing("thumbnail");
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
        size: this.getCardSizing("hero"),
      },
    };
  }

  private getCardSizing(type: CardType): CardDesignation["size"] {
    switch (type) {
      case "hero":
        return {
          md: 6,
          xs: 12,
        };

      default:
        return {
          md: 4,
          xs: 12,
        };
    }
  }
}
