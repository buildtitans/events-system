import type { AlertMessagesType } from "../../types/types";
import { alertMessages } from "../../tokens/AlertMessages";
import { AlertType } from "../../store/slices/RenderingSlice";


function createAlertMessages(alert: AlertType): AlertMessagesType["message"] | null {
    if ((alert.action === null) || (alert.kind === null)) return null;

    return alertMessages[alert.action][alert.kind]
};

export { createAlertMessages };