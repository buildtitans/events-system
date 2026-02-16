import type {
    SnackbarMessages,
    RequestStatus
} from "@/src/lib/types/tokens/types";
import { snackbarMessages } from "@/src/lib/tokens/AuthSnackbarMessages";

function createSnackbarMessages<
    K extends keyof SnackbarMessages
>(
    kind: K,
    status: RequestStatus
): string | null {

    if (status === "idle") return null;

    return snackbarMessages[kind][status]

}

export { createSnackbarMessages }

