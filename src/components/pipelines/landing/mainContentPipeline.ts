"use client"
import type { MainContentTabType } from "@/src/lib/store/slices/RenderingSlice";
import type { JSX } from "react";
import { loadEventsPipeline } from "../events/loadEventsPipeline";
import { usePopulateEventsList } from "@/src/lib/hooks/usePopulateEventLIst";
import { usePopulateGroups } from "@/src/lib/hooks/usePopulateGroups";
import { loadGroupsPipeline } from "../groups/loadGroupsPipeline";

const mainContentPipeline = (tab: MainContentTabType): JSX.Element | null => {
    const { eventLoadingStatus } = usePopulateEventsList();
    const groupsLoadingStatus = usePopulateGroups();

    switch (tab) {
        case "Groups":
            return loadGroupsPipeline(groupsLoadingStatus);

        case "Events":
            return loadEventsPipeline(eventLoadingStatus);
        default: {
            return null
        }
    };
}

export { mainContentPipeline }