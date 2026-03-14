"use client";
import UpdateViewerAttendanceForm from "../forms/openedEventForm";
import type { JSX } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

type MembersOnlyAttendanceFormProps = {
    scheduleStatus: EventSchemaType["status"],
    role: GroupMemberSchemaType["role"]
};

export default function MembersOnlyAttendanceForm({ scheduleStatus }: MembersOnlyAttendanceFormProps): JSX.Element | null {
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    const attendanceStatus = useSelector((s: RootState)=> s.eventDrawer.viewerAttendanceStatus);

    return (
        <AnimatePresence mode="wait">
            {(attendanceStatus) && (event.status === "ready") && (scheduleStatus === "scheduled") &&
                <UpdateViewerAttendanceForm
                    key={"update-status-form"}
                    currentStatus={attendanceStatus}
                    event_id={event.data.id}
                />}

        </AnimatePresence>
    )
};