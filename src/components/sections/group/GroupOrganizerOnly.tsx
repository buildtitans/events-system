"use client";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import GroupActionsMenu from "../../ui/nav/menus/groupActionsMenu";
import { UserInGroupRoleType } from "@/src/lib/hooks/auth/useGateGroupActions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/RenderingSlice";


export default function GroupOranizerOnly({ roleType }: { roleType: UserInGroupRoleType }): JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>();
    const openEventDrawer = () => {
        dispatch(enqueueDrawer('create event'));
    }


    if (roleType === 'organizer') {

        return <Box
            sx={{
                display: 'flex',
                height: 'auto',
                width: '100%',
                justifyContent: "flex-end",
                alignItems: "center",
            }}
        >
            <GroupActionsMenu openEventDrawer={openEventDrawer} />
        </Box>
    }


    return null;
}