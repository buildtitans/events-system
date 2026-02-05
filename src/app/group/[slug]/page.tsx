"use client"
import OpenedGroup from "@/src/components/pages/openedGroup";
import React, { useEffect, type JSX } from "react";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverStore";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { clearMembersState } from "@/src/lib/store/slices/GroupMembersSlice";
import { useHydrateOpenedGroup } from "@/src/lib/hooks/preload/useHydrateOpenedGroup";
import { use } from "react";

export default function GroupOpen({ params }: { params: Promise<{ slug: string }> }): JSX.Element {
    useRecoverStore();
    const { slug } = use(params);
    const { status } = useHydrateOpenedGroup(slug);
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