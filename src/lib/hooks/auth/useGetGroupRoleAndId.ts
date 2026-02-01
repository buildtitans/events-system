"use client";
import {
    useEffect,
    useState
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { usePathname } from "next/navigation";
import { trpcClient } from "@/src/trpc/trpcClient";
import { getIdsBySlug } from "../../utils/parsing/getIdsBySlug";
import type { GetGroupRoleAndIdHook } from "@/src/lib/types/hooks/types";
import type { UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import type { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { designateViewerKind } from "../../store/slices/GroupMembersSlice";

function checkMembership(members: GroupMembersSchemaType[], id: string): UserInGroupRoleType {

    const member = members.find((el: GroupMembersSchemaType) => el.user_id === id);

    return member?.role ?? "anonymous";
};

export const useGetGroupRoleAndId = (): GetGroupRoleAndIdHook => {
    const viewerKind = useSelector((s: RootState) => s.groupMembers.viewerKind);
    const members = useSelector((s: RootState) => s.groupMembers.members);
    const groups = useSelector((s: RootState) => s.groups.communities);
    const path = usePathname();
    const dispatch = useDispatch<AppDispatch>()
    const { groupId, organizerId } = getIdsBySlug(path, groups);


    useEffect(() => {
        if (!organizerId || (viewerKind !== "anonymous")) return;

        const executeCheckRole = async () => {
            const session = await trpcClient.auth.session.mutate();
            if (!session) return;

            const { user_id } = session;

            const role = checkMembership(members, user_id);
            dispatch(designateViewerKind(role));
        };

        void executeCheckRole();

    }, [organizerId, members]);


    return {
        groupID: groupId,
        roleType: viewerKind
    }
};