import type { CardType } from "@/src/components/ui/box/cards/eventCard";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
import { getCardSizing, designateLayoutSlot } from "@/src/server/layout/utils";

export type LayoutSlot =
    | { kind: "card", variant: CardType }
    | { kind: "stack", count: number }

function buildLayoutSlots(events: EventSchemaType[]): LayoutSlotSchemaType[] {
    const slots: LayoutSlotSchemaType[] = [];

    let i = 0;

    while (i < events.length) {
        const slot = designateLayoutSlot(i);

        if (slot.kind === "card") {
            const size = getCardSizing(slot.variant);

            slots.push({
                kind: "card",
                variant: {
                    type: slot.variant,
                    size,
                },
                event: events[i],
            });

            i++;
        }

        else {
            const remaining = events.length - i;
            const count = Math.min(slot.count, remaining);

            slots.push({
                kind: "stack",
                events: events.slice(i, i + count),
            });

            i += count;
        }
    }

    return slots;
}


export { buildLayoutSlots };