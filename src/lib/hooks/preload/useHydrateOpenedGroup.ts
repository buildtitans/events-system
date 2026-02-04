"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect, useState } from "react";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { EventsPages } from "../../store/slices/EventsSlice";
import { getGroupEvents, getViewerRoleInGroup, groupOpened } from "../../store/slices/groups/OpenedGroupSlice";
import { getGroupMembers } from "../../store/slices/GroupMembersSlice";
import { LoadingStatus } from "../../types/tokens/types";

function checkMembership(members: GroupMembersSchemaType[], id: string): GroupMembersSchemaType["role"] {

    const member = members.find((el: GroupMembersSchemaType) => el.user_id === id);

    return member?.role ?? "anonymous";
};

async function getUserId(): Promise<string | null> {

    const session = await trpcClient.auth.session.mutate();

    if (!session) return null;

    const { user_id } = session;

    return user_id;
};

export const useHydrateOpenedGroup = (slug: GroupSchemaType["slug"]): { status: LoadingStatus } => {
    const [status, setStatus] = useState<LoadingStatus>("idle");
    const dispatch = useDispatch<AppDispatch>();

    async function handleTrpcResponses(
        events: EventsPages | null | undefined,
        user_id: string | null | undefined,
        members: GroupMembersSchemaType[],
        group: GroupSchemaType | null | undefined
    ) {
        if (user_id) {
            const role = checkMembership(members, user_id);
            dispatch(getViewerRoleInGroup(role));
        }

        if ((Array.isArray(members) && (members.length > 0))) {
            dispatch(getGroupMembers(members));
        }

        if ((Array.isArray(events)) && (events.length > 1)) {
            dispatch(getGroupEvents(events));
        };

        if (group) {
            dispatch(groupOpened(group));
        }

        setStatus("idle");
    }

    useEffect(() => {

        const executeGetGroupBySlug = async () => {
            setStatus("pending");
            try {
                const group = await trpcClient.groups.groupBySlug.mutate(slug);
                const members = await trpcClient.groupMembers.getGroupMembers.mutate(group.id);
                const events = await trpcClient.events.groupEvents.mutate(group.id);
                const user_id = await getUserId();

                await handleTrpcResponses(
                    events,
                    user_id,
                    members,
                    group
                );

            } catch (err) {
                console.error(err);
                setStatus("failed");
            }


        }

        void executeGetGroupBySlug();

    }, []);

    return { status }
}