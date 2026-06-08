import { AlertResult } from "@/src/client/components/ui/feedback/alerts/Alerts";
import { createAlertMessages } from "@/src/lib/utils/helpers/messages/createAlertMessages";
import { AlertType } from "@/src/lib/store/slices/rendering/types";
import { assertNever } from "@/src/lib/utils/assert/assertNever";
import { JSX } from "react";

const alertsPipeline = (alert: AlertType): JSX.Element | null => {

    switch(alert.kind) {
        case "error":
        case "success": {
            return (
                <AlertResult
            key={"alert"}
            severity={alert.kind}
            variant="filled"
            message={createAlertMessages(alert)}
        />
            )
        };

        case null: {
            return null;
        }

        default: {
            return assertNever(alert.kind)
        }
    }
};

export { alertsPipeline };