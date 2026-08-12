import type { SnackbarStatusAndKind } from "@/src/lib/store/slices/rendering/types";
import type { NewEventInput } from "@/src/lib/types/hooks/types";

export function disableCreateEventButton({
  snackbar,
  newEvent,
}: {
  snackbar: SnackbarStatusAndKind;
  newEvent: NewEventInput;
}) {
  const filledOutForm =
    !!newEvent.title && !!newEvent.starts_at && !!newEvent.group_id;

  const isScheduling =
    snackbar.kind === "newEvent" && snackbar.status === "pending";

  return !filledOutForm || isScheduling;
}
