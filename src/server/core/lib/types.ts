import type { CardDesignationSchemaType } from "@/src/schemas/events/layoutSlotSchema";

export type MobileEventCard = 12;
export type DesktopEventCard = 6 | 4;

export type EventCardSizes = {
  xs: MobileEventCard;
  md: DesktopEventCard;
};

export type CardType = "hero" | "thumbnail";

export type CardDesignation = {
  size: EventCardSizes;
  type: CardType;
};

export type LayoutSlot =
  | { kind: "card"; variant: CardDesignationSchemaType }
  | { kind: "stack"; count: number };
