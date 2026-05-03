"use client";
import { RenderEventsForGroup } from "./renderEventsForGroup";
import { JSX } from "react";
import { CurrentDisplay } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import RenderGroupHistory from "./renderGroupHistory";
import GroupCalandar from "@/src/client/features/group/groupCalandar";

type RenderCurrentViewProps = {
  view: CurrentDisplay;
  isMobile: boolean
};

export default function RenderCurrentView ({ view, isMobile }: RenderCurrentViewProps): JSX.Element {

    switch(view) {
        case "overview": {
            return <GroupCalandar />
        }

        case "group history": {
            return <RenderGroupHistory 
            isMobile={isMobile}
            />
        }

        case "events": {
                <RenderEventsForGroup />
        }
        
        default: {
            return (
                         <RenderEventsForGroup />
            )
        }
    }
}