"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllGroups } from "../store/slices/GroupsSlice";
import type { RootState, AppDispatch } from "../store";
import { LoadingStatus } from "../types/types";
import { trpcClient } from "@/src/trpc/trpcClient";



const usePopulateGroups = (): LoadingStatus => {
    const [groupsLoadingStatus, setGroupsLoadingStatus] = useState<LoadingStatus>('pending');
    const timerRef = useRef<number | null>(null);
    const groups = useSelector((s: RootState) => s.groups.communities);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (groups.length > 0) return;

        const loadGroups = async () => {
            const { items } = await trpcClient.groups.list.mutate()

            if (items.length < 1) console.error("no groups to dispatch");

            dispatch(getAllGroups(items));

            timerRef.current = window.setTimeout(() => {
                setGroupsLoadingStatus((items.length > 0)
                    ? "idle"
                    : "failed"
                );
                timerRef.current = null
            }, 1200)
        };

        loadGroups();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };

    }, [groups, groupsLoadingStatus]);

    return groupsLoadingStatus;
};

export { usePopulateGroups };


