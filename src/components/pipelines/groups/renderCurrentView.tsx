"use client";
import type { ViewType } from "@/src/components/sections/group/viewGroupSection";
import { RenderEventsForGroup } from "./renderEventsForGroup";
import { JSX } from "react";
import GroupDescription from "../../sections/group/groupDescription";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";


export const RenderCurrentView = (view: ViewType, group: GroupSchemaType): JSX.Element => {


    switch(view) {

        case "overview": {
            return(
                <>
                <GroupDescription 
                group={group}
                />
                <RenderEventsForGroup />
                </>
            )
        }
        
        default: {
            return (
                <RenderEventsForGroup />
            )
        }
    }
}