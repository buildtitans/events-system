import { AlertResult } from "@/src/components/ui/feedback/alerts/Alerts";
import { createAlertMessages } from "@/src/lib/utils/helpers/createAlertMessages";
import { AlertType } from "@/src/lib/store/slices/rendering/RenderingSlice";

const alertsPipeline = (alert: AlertType) => {
    if ((alert.action === null) || (alert.kind === null)) return null;

    return (
        <AlertResult
            severity={alert.kind}
            variant="filled"
            message={createAlertMessages(alert)}
        />
    )
};

export { alertsPipeline };