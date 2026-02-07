import OpenedGroup from "@/src/components/pages/openedGroup";
import { type JSX } from "react";

export default async function GroupOpen(
    { params }: {
        params: Promise<{
            slug: string
        }>
    }): Promise<JSX.Element> {
    const { slug } = await params;

    return (
        <OpenedGroup
            slug={slug}
        />
    )
}