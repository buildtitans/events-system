"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect } from "react";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { GetGroupMembersHook } from "../../types/hooks/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getGroupMembers } from "../../store/slices/GroupMembersSlice";


const useGetGroupMembers = (group_id: GroupSchemaType["id"] | null | undefined): GetGroupMembersHook => {
    const members = useSelector((s: RootState) => s.groupMembers.members);
    const dispatch = useDispatch<AppDispatch>();

    console.log(members);

    useEffect(() => {
        if (!group_id) return;

        const executeGetMembers = async () => {

            const res = await trpcClient.groupMembers.getGroupMembers.mutate(group_id);
            dispatch(getGroupMembers(res));
        };

        void executeGetMembers();

    }, [group_id]);

    return { members };
};

export { useGetGroupMembers };