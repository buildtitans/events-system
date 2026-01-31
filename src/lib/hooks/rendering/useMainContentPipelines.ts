"use client"
import type { JSX } from "react"
import { loadEventsPipeline } from "@/src/components/pipelines/events/loadEventsPipeline"
import { MainContentTabType } from "../../store/slices/RenderingSlice"
import { usePopulateEventsList } from "../init/usePopulateEventLIst"
import { useSelector } from "react-redux"
import type { RootState } from "../../store"

export const useMainContentPipelines = (tab: MainContentTabType): JSX.Element | null => {
    const { eventLoadingStatus } = usePopulateEventsList();
    const eventsPages = useSelector((s: RootState) => s.events.eventPages)

    switch (tab) {

        default: {
            return loadEventsPipeline(eventLoadingStatus, eventsPages);
        }
    };
};