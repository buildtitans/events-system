import { CardDesignationSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { getCardSizing } from "./getCardSizing";

export type LayoutSlot =
    | { kind: "card", variant: CardDesignationSchemaType }
    | { kind: "stack", count: number }


function designateLayoutSlot(index: number, pageLength: number): LayoutSlot {

    if (index === 3 && pageLength - index >= 2) {
        return { kind: "stack", count: 2 };
    }

    if (index === 2 || index === 5) {
        const cardSize = getCardSizing("thumbnail")
        return {
            kind: "card", variant: {
                type: "thumbnail", size: cardSize
            }
        };
    }

    return {
        kind: "card", variant: {
            type: "hero", size: getCardSizing("hero")
        }
    };

}

export { designateLayoutSlot };