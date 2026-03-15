import { eventValidator } from "@/src/lib/utils/validation/validateSchema";
import { AuthorsValidator } from "@/src/lib/utils/validation/validateSchema";
import { layoutSlotValidator } from "@/src/lib/utils/validation/validateSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  LayoutSlotSchemaType,
  PaginatedLayoutSchemaType,
} from "@/src/schemas/events/layoutSlotSchema";
import { designateLayoutSlot } from "../../layout/utils";
import { chunkEventsIntoPages } from "../../layout/utils/chunkIntoPages";

export class LayoutFormatter {
  constructor() {}

  public compileLayout(events: EventSchemaType[]): PaginatedLayoutSchemaType {
    const layout = this.buildLayoutSlots(events);
    return layoutSlotValidator(layout);
  }

  private buildLayoutSlots(
    events: EventSchemaType[],
  ): PaginatedLayoutSchemaType {
    const paginatedEvents = chunkEventsIntoPages(events);

    const paginatedLayoutSlots = [];

    for (const page of paginatedEvents) {
      const slots: LayoutSlotSchemaType[] = [];

      let i = 0;

      while (i < page.length) {
        const slot = designateLayoutSlot(i, page.length);

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
}
