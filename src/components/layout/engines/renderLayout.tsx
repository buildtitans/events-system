import { JSX } from "react";
import { EventCard, type EventCardProps } from "@/src/components/ui/box/cards/eventCard";
import { EventStackSlot } from "@/src/components/ui/box/slots/eventStackSlot";
import { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";

function renderLayout(
    slots: LayoutSlotSchemaType[],
    handleBlur: EventCardProps["handleBlur"],
    handleFocus: EventCardProps["handleFocus"],
    focusedCardIndex: EventCardProps["focusedCardIndex"]
): JSX.Element[] {
    return slots.map((slot, i: number) => {

        switch (slot.kind) {
            case "card":
                return (
                    <EventCard
                        index={i}
                        key={slot.event.id}
                        event={slot.event}
                        variant={slot.variant}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                    />
                )

            default: {
                return (
                    <EventStackSlot
                        key={slot.events.map(e => e.id).join("+")}
                        events={slot.events}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                    />
                )
            }
        }
    });
}

export { renderLayout }
