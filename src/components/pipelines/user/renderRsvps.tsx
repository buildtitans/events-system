import type {  PariticpationsState } from "@/src/lib/store/slices/user/types";
import MyRsvps from "../../sections/user/myRsvps";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";
import { JSX } from "react";

type RenderRsvpsProps = { participations: PariticpationsState };

export default function RenderRsvps({ participations }: RenderRsvpsProps): JSX.Element {


    switch(participations.status) {
        case "pending": {
            return (<SimpleBackdrop/>)
        }
        case "ready": {
            return (
                <MyRsvps rsvps={participations.data.rsvps} />
            )
        }

            case "failed": {
              return <AsyncFailedFallback error={participations.error} />;
            }
            case "n/a": {
              <AsyncFailedFallback message={participations.message} />;
            }
        

        default: {
            return (<SimpleBackdrop />)
        }
    }
}