"use client";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect, useState } from "react";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import { GetGroupMembersHook } from "../../types/hooks/types";


const useGetGroupMembers = (group_id: GroupSchemaType["id"] | null | undefined): GetGroupMembersHook => {
    const [members, setMembers] = useState<GroupMembersSchemaType[]>([]);


    useEffect(() => {
        if (members !== null || (!group_id)) return;

        const executeGetMembers = async () => {

            const res = await trpcClient.groupMembers.getGroupMembers.mutate(group_id);

            setMembers(res);
        };

        void executeGetMembers();

    }, [members, group_id]);

    return { members };
};

export { useGetGroupMembers };