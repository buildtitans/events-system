"use client";
import Drawer from "@mui/material/Drawer";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { useHydrateEventDrawer } from "@/src/lib/hooks/hydration/useHydrateEventDrawer";
import { JSX } from "react";
import { OpenedDrawerContents } from "@/src/components/pipelines/drawers/openedDrawerContents";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";

export default function RightAnchoredDrawerHost(): JSX.Element | null {
    useHydrateEventDrawer();
    const dispatch = useDispatch<AppDispatch>();
    const drawerType = useSelector((s: RootState) => s.rendering.drawer);

    return (
        <Drawer
            anchor="right"
            open={(drawerType !== null)}
            onClose={() => dispatch(enqueueDrawer(null))}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                height: '100%',
            }}
            slotProps={{
                paper: {
                    elevation: 4,
                    sx: {
                        width: 500,
                        backgroundColor: 'black',
                    },
                }
            }}
        >
            {(drawerType !== null) && <OpenedDrawerContents drawerType={drawerType} />}
        </Drawer>
    );
};