"use client";
import { RootState } from "@/src/lib/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RelativeSpinner } from "../../ui/feedback/pending/spinner";
import GroupsPagesContainer from "../../sections/group/groupsPages";
import AsyncFailedFallback from "../../ui/feedback/failure/asyncFailedFallback";

export default function RenderLandingGroupsTab(): JSX.Element {
const landingGroupsTab = useSelector((s: RootState) => s.groups.landingGroupsTab);

switch(landingGroupsTab.status) {

    case "pending": {
        return <RelativeSpinner />
    }
    case "ready": {
        return <GroupsPagesContainer groupsPages={landingGroupsTab.data} />
    }
    case "failed": {
        return <AsyncFailedFallback message={landingGroupsTab.error} />
    }

    default: {
        return <RelativeSpinner />
    }
}
    
}