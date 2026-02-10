"use client";
import UpdateViewerAttendanceForm from "../forms/openedEventForm";
import type { JSX } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";

type MembersOnlyAttendanceFormProps = {
    scheduleStatus: EventSchemaType["status"],
    role: GroupMembersSchemaType["role"]
};

export default function MembersOnlyAttendanceForm({ scheduleStatus, role }: MembersOnlyAttendanceFormProps): JSX.Element | null {
    const viewer = useSelector((s: RootState) => s.eventDrawer.viewerAttendanceInfo);

    return (
        <AnimatePresence mode="wait">
            {(viewer) && (scheduleStatus === "scheduled") &&
                <UpdateViewerAttendanceForm
                    role={role}
                    key={"update-status-form"}
                    currentStatus={viewer.status ?? "not_going"}
                    event_id={viewer.event_id}
                />}

        </AnimatePresence>
    )
};