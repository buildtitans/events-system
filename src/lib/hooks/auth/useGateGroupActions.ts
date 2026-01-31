"use client";
import {
    useEffect,
    useState
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { usePathname } from "next/navigation";
import type {
    GroupSchemaType,
    GroupsSchemaType
} from "@/src/schemas/groupSchema";
import { trpcClient } from "@/src/trpc/trpcClient";

export type UserInGroupRoleType =
    'anonymous'
    | 'member'
    | 'organizer';

export type OrganizerAndUserIdsType = {
    groupId: string | undefined | null,
    organizerId: string | undefined | null
}

export type GateGroupActionsHook = {
    groupID: OrganizerAndUserIdsType["groupId"],
    roleType: UserInGroupRoleType
}

function getIdsBySlug(path: string, groups: GroupsSchemaType): OrganizerAndUserIdsType {

    const slug = path.split('/').filter(Boolean).pop();

    const currentGroup = groups.find((group: GroupSchemaType) => group.slug === slug);

    const groupId = currentGroup?.id;
    const organizerId = currentGroup?.organizer_id

    return { groupId, organizerId }
};

export const useGateGroupActions = () => {
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