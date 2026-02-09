import { JSX, useCallback } from "react";
import EventCard, { type EventCardProps } from "@/src/components/ui/box/cards/eventCard";
import { EventStackSlot } from "@/src/components/ui/box/slots/eventStackSlot";
import { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { openEventDrawer } from "@/src/lib/store/slices/events/EventDrawerSlice";


function RenderLayout(
    slots: LayoutSlotSchemaType[],
    handleBlur: EventCardProps["handleBlur"],
    handleFocus: EventCardProps["handleFocus"],
    focusedCardIndex: EventCardProps["focusedCardIndex"]
): JSX.Element[] {
    const groupNamesById = useSelector((s: RootState) => s.events.nameByGroupId);
    const dispatch = useDispatch<AppDispatch>();

    const handleOpenEvent = useCallback((event: EventCardProps["event"]) => {
        return () => {
            dispatch(openEventDrawer(event))
        }
    }, [dispatch]);

    return slots.map((slot, i: number) => {

        switch (slot.kind) {
            case "card":
                return (
                    <EventCard
                        groupName={groupNamesById[slot.event.group_id]}
                        index={i}
                        key={slot.event.id}
                        event={slot.event}
                        variant={slot.variant}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                        handleOpenEvent={handleOpenEvent}
                    />
                )

            default: {
                return (
                    <EventStackSlot
                        groupNamesById={groupNamesById}
                        key={slot.events.map(e => e.id).join("+")}
                        events={slot.events}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                        handleOpenEvent={handleOpenEvent}
                    />
                )
            }
        }
    });
}

export { RenderLayout }
