import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { EventsPages } from "../../store/slices/events/types";
import type { LayoutSlotSchemaType } from "@/src/schemas/events/layoutSlotSchema";

export type UpcomingEventIds = EventSchemaType["id"][];

const WINDOW = 30 * 24 * 60 * 60 * 1000;

function curateUpcomingEventIds(
    events: EventsPages
): UpcomingEventIds {
    const upcomingEventIds: UpcomingEventIds = [];
    const nowMs = Date.now();

    for (let i = 0; i < events.length; i++) {
        const page = events[i];
        for (let j = 0; j < page.length; j++) {
            const candidate = page[j];
            handleSlot(candidate, nowMs, upcomingEventIds);
        }
    }

    return upcomingEventIds;
};

function handleSlot(
    slot: LayoutSlotSchemaType,
    nowMs: number,
    upcomingEventIds: UpcomingEventIds
): void {
    switch (slot.kind) {
        case "card": {
            const isValidCandidate = isUpcoming(
                slot.event,
                nowMs
            );
            if (isValidCandidate) upcomingEventIds.push(slot.event.id);
            return;
        }
        case "stack": {
            handleStack(slot, upcomingEventIds, nowMs)
            return;
        }
        default: {
            return;
        }
    };
};

function handleStack(
    slot: Extract<LayoutSlotSchemaType, { kind: "stack" }>,
    upcomingEventIds: UpcomingEventIds,
    nowMs: number
): void {
    const events = slot.events;

    for (let i = 0; i < events.length; i++) {
        const candidate = events[i];
        const isValidCandidate = isUpcoming(
            candidate,
            nowMs
        )
        if (isValidCandidate) upcomingEventIds.push(candidate.id);
    }
};

function isUpcoming(
    event: EventSchemaType,
    nowMs: number

): boolean {
    const windowEndMs = nowMs + WINDOW;
    const starts_at_ms = event.starts_at_ms;
    return ((starts_at_ms >= nowMs) && (starts_at_ms <= windowEndMs));
}

export { curateUpcomingEventIds };