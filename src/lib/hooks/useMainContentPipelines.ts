"use client"
import type { JSX } from "react"
import { loadEventsPipeline } from "@/src/components/pipelines/events/loadEventsPipeline"
import { loadGroupsPipeline } from "@/src/components/pipelines/groups/loadGroupsPipeline"
import { MainContentTabType } from "../store/slices/RenderingSlice"
import { usePopulateEventsList } from "./usePopulateEventLIst"
import { usePopulateGroups } from "./usePopulateGroups"

export const useMainContentPipelines = (tab: MainContentTabType): JSX.Element | null => {
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
};