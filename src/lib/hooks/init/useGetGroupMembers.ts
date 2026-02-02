"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect, useRef } from "react";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { GetGroupMembersHook } from "../../types/hooks/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getGroupMembers } from "../../store/slices/GroupMembersSlice";
import { UserInGroupRoleType } from "../../types/tokens/types";


const useGetGroupMembers = (group_id: GroupSchemaType["id"] | null | undefined, roleType: UserInGroupRoleType): GetGroupMembersHook => {
    const members = useSelector((s: RootState) => s.groupMembers.members);
    const dispatch = useDispatch<AppDispatch>();
    const roleRef = useRef<UserInGroupRoleType | null>(null);


    useEffect(() => {
        if (roleRef.current === roleType) return;
        if (!group_id) return;
        roleRef.current = roleType


        const executeGetMembers = async () => {

            const res = await trpcClient.groupMembers.getGroupMembers.mutate(group_id);
            dispatch(getGroupMembers(res));
        };

        void executeGetMembers();

    }, [group_id, roleType]);

    return { members };
};

export { useGetGroupMembers };