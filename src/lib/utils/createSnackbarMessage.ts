import type { SnackbarMessages, RequestStatus } from "@/src/lib/types/types";
import { snackbarMessages } from "../tokens/AuthSnackbarMessages";

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

