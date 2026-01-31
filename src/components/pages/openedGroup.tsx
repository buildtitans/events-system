"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import { useMainContentPipelines } from "@/src/lib/hooks/rendering/useMainContentPipelines";
import { useGetGroupEvents } from "@/src/lib/hooks/init/useGetGroupEvents";
import type { UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import GroupOranizerOnly from "../sections/group/GroupOrganizerOnly";

type OpenedGroupProps = {
    groupID: string | null | undefined, roleType: UserInGroupRoleType
}

export default function OpenedGroup({ groupID, roleType }: OpenedGroupProps): JSX.Element {
    useGetGroupEvents(groupID);
    const tab = useSelector((s: RootState) => s.rendering.mainContent);
    const content = useMainContentPipelines(tab);

    //TODO: display only the events relevant to the opened group, endoint to get events associated with the current group is already in place

    return (
        <Box
            component={"section"}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
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