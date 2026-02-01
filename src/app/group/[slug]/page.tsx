"use client"
import OpenedGroup from "@/src/components/pages/openedGroup";
import { useEffect, type JSX } from "react";
import { useGetGroupRoleAndId } from "@/src/lib/hooks/auth/useGetGroupRoleAndId";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverData";
import { useGetGroupMembers } from "@/src/lib/hooks/init/useGetGroupMembers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { clearMembersState } from "@/src/lib/store/slices/GroupMembersSlice";

export default function GroupOpen(): JSX.Element {
    useRecoverStore();
    const { groupID, roleType } = useGetGroupRoleAndId();
    const { members } = useGetGroupMembers(groupID, roleType);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        return () => {
            dispatch(clearMembersState());
        }
    }, [dispatch]);

    return (
        <OpenedGroup
            members={members}
            groupID={groupID}
            roleType={roleType}
        />
    )
}