"use client";
import Box from "@mui/material/Box";
import { JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { useMainContentPipelines } from "@/src/lib/hooks/rendering/useMainContentPipelines";
import Button from "@mui/material/Button";
import { enqueueDrawer } from "@/src/lib/store/slices/RenderingSlice";
import { useRecoverStore } from "@/src/lib/hooks/init/useRecoverData";
import { useGetGroupEvents } from "@/src/lib/hooks/init/useGetGroupEvents";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import GroupActionsMenu from "../ui/nav/menus/groupActionsMenu";

export default function OpenedGroup(): JSX.Element {
    useRecoverStore();
    const groups = useSelector((s: RootState) => s.groups.communities);
    const path = usePathname();
    const group_id = useMemo(() => {
        const slug = path.split('').slice(8).join('');

        const currentGroup = groups.find((group: GroupSchemaType) => group.slug === slug);
        return currentGroup?.id;
    }, [path, groups])
    useGetGroupEvents(group_id ?? "");
    const dispatch = useDispatch<AppDispatch>();
    const tab = useSelector((s: RootState) => s.rendering.mainContent);
    const content = useMainContentPipelines(tab);

    const openEventDrawer = () => {
        dispatch(enqueueDrawer('create event'));
    }

    return (
        <Box
            component={"section"}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    height: 'auto',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <GroupActionsMenu openEventDrawer={openEventDrawer} />
            </Box>



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