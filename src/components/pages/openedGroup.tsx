"use client";
import { JSX, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { syncOpenedGroup } from "@/src/lib/store/sync/syncOpenedGroup";
import { RenderOpenedGroup } from "../pipelines/groups/renderOpenedGroup";
import Container from "@mui/material/Container";

type OpenedGroupProps = {
    slug: string
}

export default function OpenedGroup({
    slug
}: OpenedGroupProps
): JSX.Element | null {
    const {
        events,
        group
    } = useSelector((s: RootState) => s.openGroup);

    useEffect(() => {

        void syncOpenedGroup(slug);

    }, [slug]);


    return (
        <Container sx={{
            minHeight: "100svh",
            minWidth: "100%"
        }}>
            <RenderOpenedGroup
                events={events}
                group={group}
            />
        </Container>

    )
}