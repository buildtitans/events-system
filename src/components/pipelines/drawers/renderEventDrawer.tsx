"use client";
import type { JSX } from "react";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import OpenedEvent from "../../ui/stack/OpenedEvent";
import CheckOutGroupButton from "../../ui/buttons/checkOutGroupButton";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import RescheduleEventForm from "../../sections/forms/rescheduleEventForm";
import { NumberOfAttendantsType } from "@/src/lib/store/slices/events/EventDrawerSlice";

type RenderEventDrawerContentsProps = {
    role: GroupMembersSchemaType["role"],
    event: EventSchemaType,
    numAttendants: NumberOfAttendantsType
}

export default function RenderEventDrawerContents({
    role,
    event,
    numAttendants
}: RenderEventDrawerContentsProps): JSX.Element | null {

    switch (role) {
        case "member":
            return (
                <>
                    <OpenedEvent
                        event={event}
                        numAttendants={numAttendants}
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
                        numAttendants={numAttendants}
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