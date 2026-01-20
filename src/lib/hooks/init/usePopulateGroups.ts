"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllGroups } from "@/src/lib/store/slices/GroupsSlice";
import type { RootState, AppDispatch } from "@/src/lib/store";
import { LoadingStatus } from "@/src/lib/types/types";
import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupsSchemaType } from "@/src/schemas/groupSchema";
import { mapEventGroups } from "../../utils/rendering/mapEventGroups";
import { populateEventGroups } from "../../store/slices/EventsSlice";

const usePopulateGroups = (): LoadingStatus => {
    const [groupsLoadingStatus, setGroupsLoadingStatus] = useState<LoadingStatus>('idle');
    const groups = useSelector((s: RootState) => s.groups.communities);
    const dispatch = useDispatch<AppDispatch>();

    function handleGroupsResults(result: GroupsSchemaType) {
        if (result) {
            dispatch(getAllGroups(result));
            const groupsById = mapEventGroups(result);
            dispatch(populateEventGroups(groupsById));
        }
        setGroupsLoadingStatus(
            ((Array.isArray(result)) && (result.length > 0))
                ? "idle"
                : "failed"
        );
    }

    useEffect(() => {

        if (groups.length > 0) return;

        const loadGroups = async () => {
            setGroupsLoadingStatus('pending')
            try {
                const result = await trpcClient.groups.list.mutate();
                handleGroupsResults(result);

            } catch (err) {
                console.error(err);
                setGroupsLoadingStatus("failed");
            }


        };

        loadGroups();

    }, [groups.length, dispatch]);

    return groupsLoadingStatus;
}

export { usePopulateGroups }


