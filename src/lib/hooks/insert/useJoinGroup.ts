"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { enqueueSnackbar } from "../../store/slices/RenderingSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect, useRef } from "react";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { addToGroupMembersState, getViewerPermissions } from "../../store/slices/GroupMembersSlice";
import { JoinGroupHook } from "../../types/hooks/types";
import { mapGroupAccessPermissions } from "../../tokens/accessPermissions";
import { syncPermissions } from "../../store/sync/syncDomains";

const useJoinGroup = (): JoinGroupHook => {
    const groups = useSelector((s: RootState) => s.groups.communities);
    const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
    const dispatch = useDispatch<AppDispatch>();
    const timerRef = useRef<number | null>(null);

    async function handleResult(res: GroupMembersSchemaType | null) {
        if (res) {
            dispatch(addToGroupMembersState(res))

            const permissions = await syncPermissions();

            dispatch(getViewerPermissions(permissions));
        }

        timerRef.current = window.setTimeout(() => {
            dispatch(enqueueSnackbar({ kind: 'joiningGroup', status: res ? "success" : 'failed' }));
            timerRef.current = null;
        }, 800);
    };

    const joinGroup = async (group_id: GroupSchemaType["id"]): Promise<GroupMembersSchemaType | null> => {
        const res = await trpcClient
            .groupMembers
            .addNewMember
            .mutate(group_id);
        return res;
    };

    const handleClick = async (group_id: GroupSchemaType["id"]) => {
        if (snackbar.status !== "idle") return;
        dispatch(enqueueSnackbar({ kind: "joiningGroup", status: "pending" }))
        const result = await joinGroup(group_id);
        handleResult(result);
    };

    useEffect(() => {

        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current)
            }
        }
    }, []);

    return {
        handleClick,
    };
};

export { useJoinGroup };