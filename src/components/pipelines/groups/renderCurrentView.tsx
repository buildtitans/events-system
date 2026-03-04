"use client";
import { RenderEventsForGroup } from "./renderEventsForGroup";
import { JSX } from "react";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import Overview from "../../sections/group/displays/overview";
import { CurrentDisplay } from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import GroupHistory from "../../sections/group/displays/groupHistory";


export const RenderCurrentView = (
    view: CurrentDisplay, 
    group: GroupSchemaType
): JSX.Element => {


    switch(view) {
        case "overview": {
            return <Overview group={group} />
        }

        case "group history": {
            return <GroupHistory />
        }
        
        default: {
            return (
                <RenderEventsForGroup />
            )
        }
    }
}