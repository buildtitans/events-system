import { designateLayoutSlot } from "@/src/lib/utils/designateLayoutSlot";
import type { EventSchemaType } from "@/src/schemas/eventSchema";
import { JSX } from "react";
import { EventCard, EventCardProps } from "../../layout/box/cards/eventCard";
import { getCardSizing } from "@/src/lib/utils/getCardSizing";
import { EventStackSlot } from "../../layout/box/slots/eventStackSlot";


function renderLayout(events: EventSchemaType[], handleBlur: EventCardProps["handleBlur"], handleFocus: EventCardProps["handleFocus"], focusedCardIndex: EventCardProps["focusedCardIndex"]) {

    const output: JSX.Element[] = [];
    let i: number = 0;


    while (i < events.length) {
        const slot = designateLayoutSlot(i);

        if (slot.kind === "card") {

            const sizing = getCardSizing(slot.variant)

            output.push(
                <EventCard
                    event={events[i]}
                    key={events[i].id}
                    variant={{ type: slot.variant, size: sizing }}
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                />
            )
            i++
        } else if (slot.kind === "stack") {
            const remaining = events.length - i;

            if (remaining < slot.count) {
                output.push(
                    <EventCard
                        key={events[i].id}
                        event={events[i]}
                        variant={{ type: "hero", size: getCardSizing("hero") }}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                    />
                )
                i++
                continue
            }


            const group = events.slice(i, i + slot.count)

            output.push(
                <EventStackSlot
                    events={group}
                    key={group.map((event: EventSchemaType) => event.id).join("+")}
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                />
            )

            i += slot.count
        }
    }

    return output
}

export { renderLayout }