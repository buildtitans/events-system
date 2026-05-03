"use client";
import Drawer from "@mui/material/Drawer";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { JSX } from "react";
import { OpenedDrawerContents } from "@/src/client/components/pipelines/drawers/forks/openedDrawerContents";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { openedEventDrawerPaperSx } from "@/src/styles/sx/openedEventDrawer";
import { authDrawerPaperSx } from "@/src/styles/sx/authDrawer";
import { createEventDrawerPaperSx } from "@/src/styles/sx/createEventDrawer";
import { createGroupDrawerPaperSx } from "@/src/styles/sx/createGroupDrawer";

export default function RightAnchoredDrawerHost(): JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>();
    const drawerType = useSelector((s: RootState) => s.rendering.drawer);
    const isEventDrawer = drawerType === "event drawer";
    const isAuthDrawer =
      drawerType === "sign in drawer" || drawerType === "sign up drawer";
    const isCreateEventDrawer = drawerType === "create event drawer";
    const isCreateGroupDrawer = drawerType === "new group";

    return (
        <Drawer
            anchor="right"
            variant="temporary"
            open={(drawerType !== null)}
            onClose={() => dispatch(enqueueDrawer(null))}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                height: { xs: "200px", md: "100%"},
                zIndex: 1300
            }}
            slotProps={{
                paper: {
                    elevation: 4,
                    sx: isEventDrawer
                      ? openedEventDrawerPaperSx
                      : isAuthDrawer
                      ? authDrawerPaperSx
                      : isCreateEventDrawer
                      ? createEventDrawerPaperSx
                      : isCreateGroupDrawer
                      ? createGroupDrawerPaperSx
                      : {
                          width: { xs: 350, md: 550 },
                          backgroundColor: 'black',
                        },
                }
            }}
        >
            {(drawerType !== null) && <OpenedDrawerContents drawerType={drawerType} />}
        </Drawer>
    );
};
