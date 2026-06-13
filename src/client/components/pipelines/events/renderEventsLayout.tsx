import type { JSX } from "react";
import EventHeroCard, {
  type EventCardProps,
} from "@/src/client/components/ui/box/cards/eventHeroCard";
import { EventStackSlot } from "@/src/client/components/ui/box/slots/eventStackSlot";
import { LayoutSlotSchemaType } from "@/src/schemas/events/layoutSlotSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useSelectEvent } from "@/src/lib/hooks/hydration/event/useSelectEvent";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

type RenderEventsLayoutProps = {
  slots: LayoutSlotSchemaType[];
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
  const groupNameLookup = useSelector(
    (s: RootState) => s.groups.groupNameLookup,
  );
  const { handleOpenEditStatus } = useSelectEvent();

  return slots.map((slot, i: number) => {
    switch (slot.kind) {
      case "card": {
        return (
          <EventHeroCard
            index={i}
            groupName={groupNameLookup[slot.event.group_id].name}
            key={slot.event.id}
            event={slot.event}
            variant={slot.variant}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            focusedCardIndex={focusedCardIndex}
            handleOpenEvent={handleOpenEditStatus}
          />
        );
      }

      case "stack": {
        return (
          <EventStackSlot
            groupNameLookup={groupNameLookup}
            key={slot.events.map((e) => e.id).join("+")}
            events={slot.events}
            handleBlur={handleBlur}
            handleFocus={handleFocus}
            focusedCardIndex={focusedCardIndex}
            handleOpenEvent={handleOpenEditStatus}
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
