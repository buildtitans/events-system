"use client";
import { JSX, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { syncOpenedGroup } from "@/src/lib/store/sync/syncOpenedGroup";
import { RenderOpenedGroup } from "../pipelines/groups/renderOpenedGroup";

export default function OpenedGroup({ slug }: { slug: string }): JSX.Element | null {
    const {
        events,
        group
    } = useSelector((s: RootState) => s.openGroup);

    useEffect(() => {

        void syncOpenedGroup(slug);
    }, [slug]);


    return (
        <RenderOpenedGroup
            events={events}
            group={group}
        />
    )
}