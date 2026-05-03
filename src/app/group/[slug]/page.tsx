import HydrateGroupBySlug from "@/src/client/components/hydration/HydrateGroupBySlug";
import OpenedGroup from "@/src/client/components/pages/openedGroup";
import { type JSX } from "react";

export default async function GroupOpen(
    { params }: {
        params: Promise<{
            slug: string
        }>
    }): Promise<JSX.Element> {
    const { slug } = await params;

    return (
        <>
            <HydrateGroupBySlug
                slug={slug}
            />
            <OpenedGroup
            />
        </>

    );
};