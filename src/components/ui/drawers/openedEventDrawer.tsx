"use client";
import Drawer from "@mui/material/Drawer";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { closeEventDrawer } from "@/src/lib/store/slices/events/EventDrawerSlice";
import { useHydrateEventDrawer } from "@/src/lib/hooks/preload/usePreloadAttendance";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import { AnimatePresence } from "framer-motion";
import OpenedEvent from "../stack/OpenedEvent";
import { usePathname, useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { useMemo } from "react";
import { GroupSchemaType } from "@/src/schemas/groupSchema";

type EventDrawerProps = {
    open: boolean,
}

export default function OpenedEventDrawer({ open }: EventDrawerProps) {
    const path = usePathname();
    const router = useRouter();
    const groups = useSelector((s: RootState) => s.groups.communities);
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    useHydrateEventDrawer();
    const dispatch = useDispatch<AppDispatch>();
    const slug = useMemo(() => {
        if (!event) return "/"
        const group = groups.find((group) =>
            group.id === event?.group_id
        ) as GroupSchemaType
        return group.slug;
    }, [event]);

    const closeDrawer = () => {
        dispatch(closeEventDrawer());
    };

    const handleDirectToGroup = () => {
        const route = `/group/${slug}`
        router.push(route);
        dispatch(closeEventDrawer());
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={closeDrawer}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                height: '100%',
            }}
            PaperProps={{
                elevation: 4,
                sx: {
                    width: 500,
                    backgroundColor: 'black',
                },
            }}
        >
            <AnimatePresence mode="wait">
                {(event) &&
                    <OpenedEvent
                        key={"event-opened"}
                        event={event}
                    />
                }
                {(path === '/') && (
                    <Button
                        size="medium"
                        variant="contained"
                        onClick={handleDirectToGroup}
                        sx={{
                            width: '90%',
                            marginX: 'auto'
                        }}
                    >
                        Check out the group
                    </Button>
                )}
            </AnimatePresence>

            {(event) && <MembersOnlyAttendanceForm
                group_id={event.group_id}
            />}
        </Drawer>
    );
};