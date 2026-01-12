import type { CardType } from "@/src/components/ui/box/cards/eventCard";

export type LayoutSlot =
    | { kind: "card", variant: CardType }
    | { kind: "stack", count: number }

//TODO: implement logic for arrays that vary from 1 to 6 in length 
// -> (index) to -> (index, pageSize) for parameters

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