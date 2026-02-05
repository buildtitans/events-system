"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import type { LoadingStatus } from "@/src/lib/types/tokens/types";
import GroupOranizerOnly from "../../sections/group/GroupOrganizerOnly";
import JoinGroupButton from "@/src/components/ui/buttons/joinGroupButton";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import FadeInOutBox from "../box/fadeInOutBox";

type GroupActonsContainerProps = {
    status: LoadingStatus,
    group_id: GroupSchemaType["id"]
}

export default function GroupActonsContainer({ status, group_id }: GroupActonsContainerProps): JSX.Element | null {
    const viewerAccess = useSelector((s: RootState) => s.groupMembers.accessPermissions[group_id]);

    console.log(viewerAccess)

    return (
        <FadeInOutBox>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                    width: "100%",
                    height: "auto",
                    paddingY: 10,
                    overflow: 'hidden'
                }}>
                <JoinGroupButton
                    status={status}
                    group_id={group_id}
                    viewerAccess={viewerAccess}
                />

                <GroupOranizerOnly
                    roleType={viewerAccess}
                />
            </Box>
        </FadeInOutBox>


    )
}