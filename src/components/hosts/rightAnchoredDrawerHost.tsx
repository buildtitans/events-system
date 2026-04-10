"use client";
import Drawer from "@mui/material/Drawer";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { JSX } from "react";
import { OpenedDrawerContents } from "@/src/components/pipelines/drawers/forks/openedDrawerContents";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function RightAnchoredDrawerHost(): JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>();
    const drawerType = useSelector((s: RootState) => s.rendering.drawer);

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
                    sx: {
                        width: { xs: 350, md: 500 },
                        backgroundColor: 'black',
                    },
                }
            }}
        >
            {(drawerType !== null) && <OpenedDrawerContents drawerType={drawerType} />}
        </Drawer>
    );
};