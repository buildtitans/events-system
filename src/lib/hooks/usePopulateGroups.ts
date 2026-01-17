"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllGroups } from "../store/slices/GroupsSlice";
import type { RootState, AppDispatch } from "../store";
import { LoadingStatus } from "../types/types";
import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupsResponse } from "@/src/trpc/types/types";
import { GroupsSchemaType } from "@/src/schemas/groupSchema";

const usePopulateGroups = (): LoadingStatus => {
    const [groupsLoadingStatus, setGroupsLoadingStatus] = useState<LoadingStatus>('pending');
    const loadedRef = useRef<boolean | null>(null);
    const groups = useSelector((s: RootState) => s.groups.communities);
    const dispatch = useDispatch<AppDispatch>();

    function handleGroupsResults(result: GroupsSchemaType) {
        if (result) {
            dispatch(getAllGroups(result));

        }
        setGroupsLoadingStatus(
            ((Array.isArray(result)) && (result.length > 0))
                ? "idle"
                : "failed"
        );
    }

    useEffect(() => {
        if ((loadedRef.current)) return;

        if (groups.length > 0) loadedRef.current = true;

        const loadGroups = async () => {
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


