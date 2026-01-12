import type { CardType } from "@/src/components/ui/box/cards/eventCard";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
import { getCardSizing, designateLayoutSlot } from "@/src/server/layout/utils";
import { chunkEventsIntoPages } from "./chunkIntoPages";

export type LayoutSlot =
    | { kind: "card", variant: CardType }
    | { kind: "stack", count: number }

function buildLayoutSlots(events: EventSchemaType[]): LayoutSlotSchemaType[][] {

    const paginatedEvents = chunkEventsIntoPages(events);

    const paginatedLayoutSlots = []

    for (const page of paginatedEvents) {
        const slots: LayoutSlotSchemaType[] = [];

        let i = 0;

        while (i < page.length) {
            const slot = designateLayoutSlot(i);

            if (slot.kind === "card") {
                const size = getCardSizing(slot.variant);

                slots.push({
                    kind: "card",
                    variant: {
                        type: slot.variant,
                        size,
                    },
                    event: page[i],
                });

                i += 1;
            }

            else {
                const remaining = page.length - i;
                const count = Math.min(slot.count, remaining);


                slots.push({
                    kind: "stack",
                    events: page.slice(i, i + count),
                });

                i += count;
            }
        }

        paginatedLayoutSlots.push(slots)

    }
    return paginatedLayoutSlots

}


export { buildLayoutSlots };