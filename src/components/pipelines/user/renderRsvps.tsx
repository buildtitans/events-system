import type { ParticipationsType } from "@/src/lib/store/slices/user/types";
import MyRsvps from "../../sections/user/myRsvps";
import SimpleBackdrop from "../../ui/feedback/pending/backdrop";
import { JSX } from "react";

type RenderRsvpsProps = { participations: ParticipationsType };

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

        default: {
            return (<SimpleBackdrop />)
        }
    }
}