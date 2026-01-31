import type { AlertMessagesType } from "@/src/lib/types/tokens/types";
import { alertMessages } from "@/src/lib/tokens/AlertMessages";
import { AlertType } from "@/src/lib/store/slices/RenderingSlice";

function createAlertMessages(
    alert: AlertType
): AlertMessagesType["message"] | null {
    if ((alert.action === null) || (alert.kind === null)) return null;

    return alertMessages[alert.action][alert.kind]
};

export { createAlertMessages };