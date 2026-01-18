"use client"
import type { JSX } from "react"
import { loadEventsPipeline } from "@/src/components/pipelines/events/loadEventsPipeline"
import { MainContentTabType } from "../store/slices/RenderingSlice"
import { usePopulateEventsList } from "./init/usePopulateEventLIst"

export const useMainContentPipelines = (tab: MainContentTabType): JSX.Element | null => {
    const { eventLoadingStatus } = usePopulateEventsList();

    switch (tab) {

        default: {
            return loadEventsPipeline(eventLoadingStatus);
        }
    };
};