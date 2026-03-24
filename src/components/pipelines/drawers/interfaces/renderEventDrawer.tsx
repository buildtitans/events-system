"use client";
import type { JSX } from "react";
import MembersOnlyAttendanceForm from "../../../sections/events/membersOnlyAttendanceForm";
import OpenedEvent from "../../../ui/stack/OpenedEvent";
import CheckOutGroupButton from "../../../ui/buttons/checkOutGroupButton";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import RescheduleEventForm from "../../../sections/forms/rescheduleEventForm";
import {
    GroupSlug,
    NameOfGroup,
    NumberOfAttendantsType
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";

type RenderEventDrawerContentsProps = {
    role: GroupMemberSchemaType["role"],
    event: EventSchemaType,
    numAttendants: NumberOfAttendantsType,
    numInterested: NumberOfAttendantsType,
    name: NameOfGroup,
    slug: GroupSlug,
}

export default function RenderEventDrawerContents({
    role,
    event,
    numAttendants,
    numInterested,
    name,
    slug,
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
            const isCurrent = isFutureOrNow(new Date(event.starts_at))
            
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

                   {(isCurrent) && <RescheduleEventForm
                        event={event}
                    />}
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