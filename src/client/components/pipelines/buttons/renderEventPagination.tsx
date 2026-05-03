import type { DomainStatus } from "@/src/lib/types/tokens/types";
import type {  EventsStateType } from "@/src/lib/store/slices/events/types";
import type { JSX } from "react";
import { PaginateEvents } from "@/src/client/components/ui/box/pagination/paginateEvents";

const RenderEventPagination = (
    eventStatus: EventsStateType["status"],
    mountStatus: DomainStatus,
    pages: number
): JSX.Element | null => {

    const show =
        eventStatus === "ready" &&
        mountStatus === "idle" &&
        pages > 1;

    if (!show) return null;

    return (
        <PaginateEvents />
    )
};

export { RenderEventPagination };