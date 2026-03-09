"use client";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import SidebarSkeleton from "../../../ui/skeletons/sidebarSkeleton";
import GroupActonsContainer from "../../../ui/stack/groupActionsContainer";

export function RenderGroupSidebar() {
const group = useSelector((s: RootState) => s.openGroup.group);


    switch(group.status) {
        case "pending": {
            return (
                <SidebarSkeleton />
            )
        }

        case "ready": { 
            return (
                <GroupActonsContainer 
                group_id={group.data.id}
                />
            )
        }
        default: {
            return null;
        }
    }
}