"use client"
import OpenedGroup from "@/src/components/pages/openedGroup";
import { useEffect, type JSX } from "react";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverData";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { clearMembersState } from "@/src/lib/store/slices/GroupMembersSlice";
import { useHydrateOpenedGroup } from "@/src/lib/hooks/preload/useHydrateOpenedGroup";

export default function GroupOpen({ params }: { params: { groupSlug: string } }): JSX.Element {
    useRecoverStore();
    const { status } = useHydrateOpenedGroup(params.groupSlug);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        return () => {
            dispatch(clearMembersState());
        }
    }, [dispatch]);

    return (
        <OpenedGroup
            status={status}
        />
    )
}