"use client";
import UpdateViewerAttendanceForm from "../forms/openedEventForm";
import type { JSX } from "react";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";

type MembersOnlyAttendanceFormProps = {
    role: GroupMembersSchemaType["role"]
}

export default function MembersOnlyAttendanceForm({ role }: MembersOnlyAttendanceFormProps): JSX.Element | null {
    const viewer = useSelector((s: RootState) => s.eventDrawer.viewerAttendanceInfo);

    return (
        <AnimatePresence mode="wait">
            {((role === "member") || (role === "organizer")) && (viewer) && <UpdateViewerAttendanceForm
                key={"update-status-form"}
                currentStatus={viewer.status ?? "not_going"}
                event_id={viewer.event_id}
            />}

        </AnimatePresence>
    )
};