"use client"
import type { JSX } from "react";
import type { FlattenedGroupEventsState } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import Calandar from "../../ui/dates/calandar";
import NoScheduledEvents from "../../ui/feedback/info/suggestScheduleEvent";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";

type RenderGroupCalandarProps = {
    flattenedGroupEvents: FlattenedGroupEventsState
}

export const RenderGroupCalandar = ({flattenedGroupEvents}: RenderGroupCalandarProps): JSX.Element => {


    switch(flattenedGroupEvents.status) {

        case "ready": {
            return (
                <Calandar history={flattenedGroupEvents.data} />
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