import type { CardType } from "@/src/components/ui/box/cards/eventCard";

export type LayoutSlot =
    | { kind: "card", variant: CardType }
    | { kind: "stack", count: number }


function designateLayoutSlot(index: number, pageLength: number): LayoutSlot {

    if (index === 3 && pageLength - index >= 2) {
        return { kind: "stack", count: 2 };
    }

    if (index === 2 || index === 5) {
        return { kind: "card", variant: "thumbnail" };
    }

    return { kind: "card", variant: "hero" };

}

export { designateLayoutSlot };