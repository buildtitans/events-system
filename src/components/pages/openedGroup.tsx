"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useMainContentPipelines } from "@/src/lib/hooks/rendering/useMainContentPipelines";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverData";
import { useGetGroupEvents } from "@/src/lib/hooks/init/useGetGroupEvents";
import { useGateGroupActions } from "@/src/lib/hooks/auth/useGateGroupActions";
import GroupOranizerOnly from "../sections/group/GroupOrganizerOnly";

export default function OpenedGroup(): JSX.Element {
    useRecoverStore();
    const { groupID, roleType } = useGateGroupActions()
    useGetGroupEvents(groupID);
    const tab = useSelector((s: RootState) => s.rendering.mainContent);
    const content = useMainContentPipelines(tab);

    return (
        <Box
            component={"section"}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4
            }}
        >
            <GroupOranizerOnly
                roleType={roleType}
            />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {content}
            </Box>



        </Box>
    )
}