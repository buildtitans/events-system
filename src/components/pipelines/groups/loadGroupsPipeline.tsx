"use client"
import type { JSX } from "react";
import { LinearIndeterminate } from "@/src/components/ui/feedback/"
import GroupsContainer from "../../ui/stack/groupsContainer";
import { NoEventsFound } from "../../ui/box/noEventsFound";
import type { LoadingStatus } from "@/src/lib/types/tokens/types"
import NoGroups from "../../ui/feedback/failure/noGroups";

const loadGroupsPipeline = (groupsLoadingStatus: LoadingStatus): JSX.Element | null => {

    switch (groupsLoadingStatus) {
        case "idle":
            return (
                <GroupsContainer />
            )
        case "pending":
            return (
                <LinearIndeterminate />
            )
        case "failed":
            return (
                <NoGroups />
            )

        default: {
            return null;
        }
    };
}

export { loadGroupsPipeline };