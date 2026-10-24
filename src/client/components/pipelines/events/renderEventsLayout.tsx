"use client";
import { lazy, Suspense, type JSX } from "react";
import { type EventCardProps } from "@/src/client/components/ui/box/cards/eventHeroCard";
import { EventStackSlot } from "@/src/client/components/ui/box/slots/eventStackSlot";
import { LayoutSlotSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import EventHeroCardSkeleton from "@/src/client/components/ui/box/cards/skeletons/eventHeroCardSkeleton";
import GroupEventHeroCard from "../../ui/box/cards/groupEventHeroCard";

const HeroCard = lazy(
  () => import("@/src/client/components/ui/box/cards/eventHeroCard"),
);

type RenderEventsLayoutProps = {
  slots: LayoutSlotSchemaType[];
  withinGroup?: boolean;
  handleBlur: EventCardProps["handleBlur"];
  handleFocus: EventCardProps["handleFocus"];
  focusedCardIndex: EventCardProps["focusedCardIndex"];
};

function RenderEventsLayout({
  slots,
  handleBlur,
  handleFocus,
  focusedCardIndex,
}: RenderEventsLayoutProps): JSX.Element[] {
  const { handleOpenEvent } = useSelectEvent();

  return slots.map((slot, i: number) => {
    switch (slot.kind) {
      case "card": {
        switch (slot.event.for) {
          case "discovery": {
            return (
              <Suspense
                key={slot.event.content.event.id}
                fallback={<EventHeroCardSkeleton variant={slot.variant} />}
              >
                <HeroCard
                  index={i}
                  summary={slot.event.content}
                  key={slot.event.content.event.id}
                  variant={slot.variant}
                  handleBlur={handleBlur}
                  handleFocus={handleFocus}
                  focusedCardIndex={focusedCardIndex}
                  handleOpenEvent={handleOpenEvent}
                />
              </Suspense>
            );
          }
          case "withinGroup": {
            return (
              <GroupEventHeroCard
                index={i}
                location={slot.event.content.event.meeting_location}
                key={slot.event.content.event.id}
                event={slot.event.content.event}
                eventMetaData={slot.event.content.meta}
                variant={slot.variant}
                handleBlur={handleBlur}
                handleFocus={handleFocus}
                focusedCardIndex={focusedCardIndex}
                handleOpenEvent={handleOpenEvent}
              />
            );
          }

          default: {
            return assertNever(slot.event);
          }
        }
      }

      case "stack": {
        return (
          <EventStackSlot
            key={slot.events.map((event) => event.content.event.id).join("+")}
            stack={slot.events}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            focusedCardIndex={focusedCardIndex}
            handleOpenEvent={handleOpenEvent}
          />
        );
      }

      default: {
        assertNever(slot);
      }
    }
  });
}

export { RenderEventsLayout };
