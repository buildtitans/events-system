"use client"
import OpenedGroup from "@/src/components/pages/openedGroup";
import { useEffect, type JSX } from "react";
import { useGetGroupRoleAndId } from "@/src/lib/hooks/auth/useGetGroupRoleAndId";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverData";
import { useGetGroupMembers } from "@/src/lib/hooks/init/useGetGroupMembers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { clearMembersState } from "@/src/lib/store/slices/GroupMembersSlice";
import { useGetGroupEvents } from "@/src/lib/hooks/init/useGetGroupEvents";

export default function GroupOpen(): JSX.Element {
    useRecoverStore();
    const { groupID, roleType, groupName } = useGetGroupRoleAndId();
    const { members } = useGetGroupMembers(groupID, roleType);
    const dispatch = useDispatch<AppDispatch>();
    const {
        groupEvents,
        status
    } = useGetGroupEvents(groupID);

    useEffect(() => {

        return () => {
            dispatch(clearMembersState());
        }
    }, [dispatch]);

    return (
        <OpenedGroup
            groupName={groupName}
            members={members}
            groupID={groupID}
            roleType={roleType}
            groupEvents={groupEvents}
            status={status}
        />
    )
}