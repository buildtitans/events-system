"use client"
import type { JSX } from "react";
import { LinearLoader } from "../../ui/feedback/pending/linearLoader";
import GroupsContainer from "../../ui/stack/groupsContainer";
import type { DomainStatus } from "@/src/lib/types/tokens/types"
import NoGroups from "../../ui/feedback/failure/noGroups";

const loadGroupsPipeline = (groupsLoadingStatus: DomainStatus): JSX.Element | null => {

    switch (groupsLoadingStatus) {
        case "idle":
            return (
                <GroupsContainer />
            )

        case "pending":
            return (
                <LinearLoader />
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