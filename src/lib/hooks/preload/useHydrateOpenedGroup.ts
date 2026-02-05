"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect, useState } from "react";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { EventsPages } from "../../store/slices/EventsSlice";
import { groupOpened } from "../../store/slices/groups/OpenedGroupSlice";
import { getViewerPermissions } from "../../store/slices/GroupMembersSlice";
import { LoadingStatus } from "../../types/tokens/types";
import { mapGroupAccessPermissions } from "../../tokens/accessPermissions";
import { getGroupEvents } from "../../store/slices/groups/OpenedGroupSlice";


export const useHydrateOpenedGroup = (slug: GroupSchemaType["slug"]): { status: LoadingStatus } => {
    const [status, setStatus] = useState<LoadingStatus>("idle");
    const dispatch = useDispatch<AppDispatch>();

    async function handleTrpcResponses(
        events: EventsPages | null | undefined,
        group: GroupSchemaType | null | undefined,
        userMemberships: GroupMembersSchemaType[] | null
    ) {

        const accessMap = mapGroupAccessPermissions(userMemberships);
        dispatch(getViewerPermissions(accessMap))

        if (events) {
            dispatch(getGroupEvents(events));
        };

        if (group) {
            dispatch(groupOpened(group));
        }

        setStatus("idle");
    }

    useEffect(() => {
        if (!slug) return;

        const executeGetGroupBySlug = async () => {
            setStatus("pending");
            try {
                const group = await trpcClient.groups.groupBySlug.mutate(slug);
                const events = await trpcClient.events.groupEvents.mutate(group.id);
                const userMemberships = await trpcClient.groupMembers.viewerMemberships.mutate();

                await handleTrpcResponses(
                    events,
                    group,
                    userMemberships
                );

            } catch (err) {
                console.error(err);
                setStatus("failed");
            }


        }

        void executeGetGroupBySlug();

    }, [slug]);

    return { status }
}