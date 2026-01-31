"use client"
import OpenedGroup from "@/src/components/pages/openedGroup";
import type { JSX } from "react";
import { useGetGroupRoleAndId } from "@/src/lib/hooks/auth/useGetGroupRoleAndId";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverData";

export default function GroupOpen(): JSX.Element {
    useRecoverStore();
    const { groupID, roleType } = useGetGroupRoleAndId();

    return (
        <OpenedGroup
            groupID={groupID}
            roleType={roleType}
        />
    )
}