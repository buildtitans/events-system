"use client";
import UpdateViewerAttendanceForm from "../forms/openedEventForm";
import type { JSX } from "react";
import { AnimatePresence } from "framer-motion";
import NotGroupMember from "../../ui/fallbacks/NotGroupMember";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { EventSchemaType } from "@/src/schemas/eventSchema";

type MembersOnlyAttendanceFormProps = {
    group_id: EventSchemaType["group_id"]
}

export default function MembersOnlyAttendanceForm({ group_id }: MembersOnlyAttendanceFormProps): JSX.Element | null {
    const viewer = useSelector((s: RootState) => s.eventDrawer.viewerAttendanceInfo);
    const viewerType = useSelector((s: RootState) => s.groupMembers.accessPermissions[group_id]);

    return (
        <AnimatePresence mode="wait">
            {(viewerType === "member") && (viewer) && <UpdateViewerAttendanceForm
                key={"update-status-form"}
                currentStatus={viewer.status ?? "not_going"}
                event_id={viewer.event_id}
            />}

            {(viewerType === "anonymous") && <NotGroupMember key={"not-a-member"} />}
        </AnimatePresence>
    )
};