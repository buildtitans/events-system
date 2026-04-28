"use client";
import { RenderEventsForGroup } from "./renderEventsForGroup";
import { JSX } from "react";
import Overview from "../../sections/group/openedGroup/displays/overview";
import { CurrentDisplay } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import RenderGroupHistory from "./renderGroupHistory";

type RenderCurrentViewProps = {
  view: CurrentDisplay;
  isMobile: boolean
};

export default function RenderCurrentView ({ view, isMobile }: RenderCurrentViewProps): JSX.Element {

    switch(view) {
        case "overview": {
            return <Overview />
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