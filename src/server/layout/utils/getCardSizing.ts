import type { CardDesignation, CardType } from "@/src/components/ui/box/cards/eventHeroCard";



function getCardSizing(type: CardType): CardDesignation["size"] {

    switch (type) {
        case "hero":
            return {
                md: 6,
                xs: 12
            }

        default:
            return {
                md: 4,
                xs: 12
            }
    };
}

export { getCardSizing };