"use client";
import type { JSX } from "react";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import OpenedEvent from "../../ui/stack/OpenedEvent";
import CheckOutGroupButton from "../../ui/buttons/checkOutGroupButton";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import RescheduleEventForm from "../../sections/forms/rescheduleEventForm";
import {
    GroupSlug,
    NameOfGroup,
    NumberOfAttendantsType
} from "@/src/lib/store/slices/events/EventDrawerSlice";

type RenderEventDrawerContentsProps = {
    role: GroupMembersSchemaType["role"],
    event: EventSchemaType,
    numAttendants: NumberOfAttendantsType,
    numInterested: NumberOfAttendantsType,
    name: NameOfGroup,
    slug: GroupSlug
}

export default function RenderEventDrawerContents({
    role,
    event,
    numAttendants,
    numInterested,
    name,
    slug
}: RenderEventDrawerContentsProps): JSX.Element | null {

    switch (role) {
        case "member":
            return (
                <>
                    <OpenedEvent
                        event={event}
                        numAttendants={numAttendants}
                        numInterested={numInterested}
                        name={name}
                        slug={slug}

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
                        numInterested={numInterested}
                        name={name}
                        slug={slug}
                    />
                    <MembersOnlyAttendanceForm
                        role={role}
                        scheduleStatus={event.status}
                    />

                    <RescheduleEventForm
                        event={event}
                    />
                </>
            )
        default: {

            return (
                <>
                    <OpenedEvent
                        event={event}
                        name={name}
                        slug={slug}
                    />

                    <CheckOutGroupButton
                        event={event}
                    />
                </>
            )
        }
    }

}