"use client"
import OpenedGroup from "@/src/components/pages/openedGroup";
import { type JSX } from "react";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverStore";
import { useHydrateOpenedGroup } from "@/src/lib/hooks/preload/useHydrateOpenedGroup";
import { use } from "react";

export default function GroupOpen({ params }: { params: Promise<{ slug: string }> }): JSX.Element {
    useRecoverStore();
    const { slug } = use(params);
    const { status } = useHydrateOpenedGroup(slug);

    return (
        <OpenedGroup
            status={status}
        />
    )
}