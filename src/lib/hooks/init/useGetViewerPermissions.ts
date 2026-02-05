"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useEffect } from "react";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { getViewerPermissions } from "../../store/slices/GroupMembersSlice";
import { mapGroupAccessPermissions } from "../../tokens/accessPermissions";

export const useGetViewerPermissions = () => {
    const userKind = useSelector((s: RootState) => s.auth.userKind);
    const dispatch = useDispatch<AppDispatch>();
    const groups = useSelector((s: RootState) => s.groups.communities);

    function handlePermissions(
        userMemberships?: GroupMembersSchemaType[]
    ) {
        const permissions = mapGroupAccessPermissions(
            groups,
            userMemberships ?? null
        );
        dispatch(getViewerPermissions(permissions));
    }


    useEffect(() => {

        const getUserPermissions = async () => {
            try {
                const userMemberships = await trpcClient.groupMembers.viewerMemberships.mutate();


                handlePermissions(userMemberships ?? [])
            } catch (err) {
                console.error(err);
            }
        }
        void getUserPermissions();
    }, [userKind, groups]);

}