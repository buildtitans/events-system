import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { ButtonActions } from "@/src/client/components/ui/drawers/contents/memberAndOrganizerActions";
import { assertNever } from "../../assert/assertNever";

export function filterActions(
  eventStatus: EventSchemaType["status"],
  actions: ButtonActions,
): ButtonActions {
  switch (eventStatus) {
    case "scheduled": {
      return actions;
    }
    case "cancelled": {
      return actions.filter((action) => action.kind !== "attendance form");
    }
    default: {
      return assertNever(eventStatus);
    }
  }
}
