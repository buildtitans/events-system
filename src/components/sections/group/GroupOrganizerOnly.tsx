"use client";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import GroupActionsMenu from "../../ui/nav/menus/groupActionsMenu";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";


export default function GroupOranizerOnly({ roleType }: { roleType: GroupMembersSchemaType["role"] }): JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>();
    const openEventDrawer = () => {
        dispatch(enqueueDrawer("create event drawer"));
    }


    if (roleType === 'organizer') {

        return <Box
            sx={{
                display: 'flex',
                flexDirection: "column",
                height: 'auto',
                width: '100%',
                justifyContent: "center",
                alignItems: "center",
                gap: 4
            }}
        >
            <GroupActionsMenu
                openEventDrawer={openEventDrawer}
            />
        </Box>
    }


    return null;
}