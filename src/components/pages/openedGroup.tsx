"use client";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RenderOpenedGroup } from "../pipelines/groups/renderOpenedGroup";
import Container from "@mui/material/Container";

export default function OpenedGroup(): JSX.Element | null {
    const {
        events,
        group
    } = useSelector((s: RootState) => s.openGroup);

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