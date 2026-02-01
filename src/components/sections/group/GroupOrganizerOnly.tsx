"use client";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import GroupActionsMenu from "../../ui/nav/menus/groupActionsMenu";
import { UserInGroupRoleType } from "@/src/lib/types/tokens/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/RenderingSlice";
import Button from "@mui/material/Button";


export default function GroupOranizerOnly({ roleType }: { roleType: UserInGroupRoleType }): JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>();
    const openEventDrawer = () => {
        dispatch(enqueueDrawer('create event'));
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
            <GroupActionsMenu openEventDrawer={openEventDrawer} />

            <Button
                variant="contained"
                id="placeholder-button"
                size="small"
                sx={{
                    borderRadius: 999,
                    width: "100%",
                    color: 'black',
                    backgroundColor: 'white',
                    ':hover': {
                        cursor: "pointer"
                    }
                }}
            >
                Manage

            </Button>


        </Box>
    }


    return null;
}