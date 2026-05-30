import type { DomainStatus } from "@/src/lib/types/tokens/types";
import type { EventsStateType } from "@/src/lib/store/slices/events/types";
import type { JSX } from "react";
import { PaginateEvents } from "@/src/client/components/ui/box/pagination/paginateEvents";
import { assertNever } from "@/src/lib/utils/assert/assertNever";

export const RenderEventPagination = (
  eventStatus: EventsStateType["status"],
  mountStatus: DomainStatus,
  pages: number,
): JSX.Element | null => {
  if ((pages < 1) || (mountStatus !== "idle")) return null;

  switch (eventStatus) {
    case "initial":
    case "pending":
    case "failed":

    case "n/a": {
      return null;
    }

    case "ready": {
      return <PaginateEvents />;
    }

    default: {
      return assertNever(eventStatus);
    }
  }
};
