"use client";
import type { JSX } from "react";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import OpenedEvent from "../../ui/stack/OpenedEvent";
import CheckOutGroupButton from "../../ui/buttons/checkOutGroupButton";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import RescheduleEventForm from "../../sections/forms/rescheduleEventForm";

type RenderEventDrawerContentsProps = {
    role: GroupMembersSchemaType["role"],
    event: EventSchemaType
}

export default function RenderEventDrawerContents({
    role,
    event
}: RenderEventDrawerContentsProps): JSX.Element | null {

    switch (role) {
        case "member":
            return (
                <>
                    <OpenedEvent
                        event={event}
                    />
                    <MembersOnlyAttendanceForm
                        role={role}
                        scheduleStatus={event.status}
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
                        role={role}
                        scheduleStatus={event.status}
                    />

                    <RescheduleEventForm event={event} />
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