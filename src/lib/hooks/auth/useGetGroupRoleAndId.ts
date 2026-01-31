"use client";
import {
    useEffect,
    useState
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { usePathname } from "next/navigation";
import { trpcClient } from "@/src/trpc/trpcClient";
import { getIdsBySlug } from "../../utils/parsing/getIdsBySlug";
import type { UserInGroupRoleType } from "../../types/types";
import type { GetGroupRoleAndIdHook } from "../../types/hooks/types";

export const useGetGroupRoleAndId = (): GetGroupRoleAndIdHook => {
    const [roleType, setRoleType] = useState<UserInGroupRoleType>('anonymous');
    const groups = useSelector((s: RootState) => s.groups.communities);
    const path = usePathname();
    const { groupId, organizerId } = getIdsBySlug(path, groups);


    useEffect(() => {
        if (!organizerId) return;

        const executeCheckRole = async () => {
            const session = await trpcClient.auth.session.mutate();
            if (!session) return;

            const { user_id } = session;

            if (user_id === organizerId) {
                setRoleType('organizer')
            }
        };

        void executeCheckRole();

    }, [organizerId]);


    return {
        groupID: groupId,
        roleType: roleType
    }
};