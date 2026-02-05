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
import { JSX, useMemo } from "react";
import { GroupSchemaType } from "@/src/schemas/groupSchema";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { retryLink } from "@trpc/client";


export default function CheckOutGroupButton({ event }: { event: EventSchemaType | null }): JSX.Element | null {
    const path = usePathname();
    const router = useRouter();
    const groups = useSelector((s: RootState) => s.groups.communities);
    const viewerAccess = useSelector((s: RootState) => s.groupMembers.accessPermissions[event?.group_id ?? ""]);
    const dispatch = useDispatch<AppDispatch>();
    const slug = useMemo(() => {
        if (!event) return "/"
        const group = groups.find((group) =>
            group.id === event?.group_id
        ) as GroupSchemaType
        return group.slug;
    }, [event]);


    const handleDirectToGroup = () => {
        const route = `/group/${slug}`
        router.push(route);
        dispatch(closeEventDrawer());
    };

    console.log(viewerAccess)

    if ((path !== "/") || (viewerAccess !== "anonymous")) return null;

    return (
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
    )
}