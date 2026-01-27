"use client"
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import Stack from "@mui/material/Stack";
import { enqueueDrawer } from "@/src/lib/store/slices/RenderingSlice";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { useCreateEvent } from "@/src/lib/hooks/insert/useCreateEvent";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { useMemo } from "react";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import NewEventForm from "../../sections/forms/newEventForm";


export default function CreateEventDrawer({ open }: { open: boolean }): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const groups = useSelector((s: RootState) => s.groups.communities);
    const path = usePathname();
    const group_id = useMemo(() => {
        const slug = path.split('').slice(8).join('');

        const currentGroup = groups.find((group: GroupSchemaType) => group.slug === slug);
        return currentGroup?.id;
    }, [path, groups])

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={() => dispatch(enqueueDrawer(null))}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                width: 'auto',
                height: '100%',
            }}

            PaperProps={{
                sx: {
                    width: 400,
                    bgcolor: "black",
                },
            }}
        >

            <NewEventForm group_id={group_id ?? ""} />
        </Drawer>
    )
}