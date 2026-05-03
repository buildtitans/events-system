import { AlertResult } from "@/src/client/components/ui/feedback/alerts/Alerts";
import { createAlertMessages } from "@/src/lib/utils/helpers/messages/createAlertMessages";
import { AlertType } from "@/src/lib/store/slices/rendering/types";

const alertsPipeline = (alert: AlertType) => {
    if ((alert.action === null) || (alert.kind === null)) return null;

    return (
        <AlertResult
            key={"alert"}
            severity={alert.kind}
            variant="filled"
            message={createAlertMessages(alert)}
        />
    )
};

export { alertsPipeline };