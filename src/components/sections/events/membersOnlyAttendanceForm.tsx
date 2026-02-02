"use client";
import UpdateViewerAttendanceForm from "../forms/openedEventForm";
import { EventAttendantsSchemaType } from "@/src/schemas/eventAttendantsSchema";
import type { JSX } from "react";
import { AnimatePresence } from "framer-motion";
import { ViewerType } from "@/src/lib/store/slices/events/EventDrawerSlice";

type MembersOnlyAttendanceFormProps = {
    viewer: EventAttendantsSchemaType | null,
    viewerType: ViewerType
}

export default function MembersOnlyAttendanceForm({ viewerType, viewer }: MembersOnlyAttendanceFormProps): JSX.Element | null {


    if ((viewerType === "anonymous") || (!viewer)) return null;

    console.log(viewer);

    return (
        <AnimatePresence mode="wait">
            <UpdateViewerAttendanceForm
                key={"update-status-form"}
                currentStatus={viewer.status ?? "not_going"}
                event_id={viewer.event_id}
            />


        </AnimatePresence>
    )
};