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
