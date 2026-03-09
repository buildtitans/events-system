"use client";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { RenderOpenedGroup } from "../pipelines/groups/renderOpenedGroup";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

export default function OpenedGroup(): JSX.Element | null {
    const {
        group
    } = useSelector((s: RootState) => s.openGroup);
    

    return (
        <Container 
        disableGutters
        sx={{
            minHeight: "100svh",
            width: { xs: "100%", md: "80%", xl: "100svw" }
        }}>
            <Stack>
                <RenderOpenedGroup
                group={group}
            />
            </Stack>
            
        </Container>

    )
}