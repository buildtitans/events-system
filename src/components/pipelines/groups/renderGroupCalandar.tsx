"use client"
import type { JSX } from "react";
import type { GroupHistoryType } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import Calandar from "../../ui/dates/calandar";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";

type RenderGroupCalandarProps = {
    history: GroupHistoryType
}

export const RenderGroupCalandar = ({history}: RenderGroupCalandarProps): JSX.Element => {


    switch(history.status) {

        case "ready": {
            return (
                <Calandar history={history.data} />
            )
        }

        case "pending": {
            return <RelativeSpinner />
        }

        default: {
          return (  <NoScheduledEvents />)
        }
    }
}