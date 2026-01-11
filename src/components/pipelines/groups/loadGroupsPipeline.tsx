"use client"
import type { JSX } from "react";
import { LinearIndeterminate } from "@/src/components/ui/feedback/"
import GroupCards from "../../ui/stack/groupCards";
import { NoEventsFound } from "../../ui/box/noEventsFound";
import type { LoadingStatus } from "@/src/lib/types/types"

const loadGroupsPipeline = (groupsLoadingStatus: LoadingStatus): JSX.Element | null => {

    switch (groupsLoadingStatus) {
        case "idle":
            return (
                <GroupCards />
            )
        case "pending":
            return (
                <LinearIndeterminate />
            )
        case "failed":
            return (
                <NoEventsFound /> // <----- replace w/groups focused failure state component
            )

        default: {
            return null;
        }
    };
}

export { loadGroupsPipeline };