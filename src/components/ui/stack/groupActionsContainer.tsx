"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import type { LoadingStatus, UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import GroupOranizerOnly from "../../sections/group/GroupOrganizerOnly";
import JoinGroupButton from "@/src/components/ui/buttons/joinGroupButton";
import FadeInOutBox from "../box/fadeInOutBox";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { AnimatePresence } from "framer-motion";

type GroupActonsContainerProps = {
    status: LoadingStatus,
    roleType: UserInGroupRoleType,
    group_id: GroupSchemaType["id"] | null | undefined
}

export default function GroupActonsContainer({ status, roleType, group_id }: GroupActonsContainerProps): JSX.Element | null {


    return (

        <Box sx={{
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
                roleType={roleType}
            />

            <GroupOranizerOnly
                roleType={roleType}
            />
        </Box>

    )
}