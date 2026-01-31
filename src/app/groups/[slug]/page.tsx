"use client"
import OpenedGroup from "@/src/components/pages/openedGroup";
import type { JSX } from "react";
import { useGateGroupActions } from "@/src/lib/hooks/auth/useGateGroupActions";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverData";

export default function GroupOpen(): JSX.Element {
    useRecoverStore();
    const { groupID, roleType } = useGateGroupActions();

    return (
        <OpenedGroup
            groupID={groupID}
            roleType={roleType}
        />
    )
}