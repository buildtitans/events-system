import type { CardType } from "@/src/components/layout/box/cards/eventCard";

export type LayoutSlot =
    | { kind: "card", variant: CardType }
    | { kind: "stack", count: number }

function designateLayoutSlot(index: number): LayoutSlot {


    switch (index) {
        case 2:
            return { kind: "card", variant: "thumbnail" }

        case 3:
            return { kind: "stack", count: 2 }

        case 5:
            return { kind: "card", variant: "thumbnail" }

        default:
            return { kind: "card", variant: "hero" }

    }
}

export { designateLayoutSlot };