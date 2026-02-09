"use client";
import type { JSX } from "react";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import OpenedEvent from "../../ui/stack/OpenedEvent";
import CheckOutGroupButton from "../../ui/buttons/checkOutGroupButton";

export default function RenderEventDrawerContents(

): JSX.Element | null {
    const permissions = useSelector((s: RootState) => s.groupMembers.accessPermissions);
    const event = useSelector((s: RootState) => s.eventDrawer.event)
    const role = permissions[event?.group_id ?? ""];
    if (!event) return null


    switch (role) {
        case "member":
            return (
                <>
                    <OpenedEvent
                        event={event}
                    />
                    <MembersOnlyAttendanceForm
                    />
                </>
            )
        case "organizer":
            return (
                <>
                    <OpenedEvent
                        event={event}
                    />
                    <MembersOnlyAttendanceForm
                    />
                </>
            )
        default: {

            return (
                <>
                    <OpenedEvent
                        event={event}
                    />

                    <CheckOutGroupButton
                        event={event}
                    />
                </>
            )
        }
    }

}