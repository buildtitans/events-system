import type { JSX } from "react";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import OpenedEvent from "../../ui/stack/OpenedEvent";
import CheckOutGroupButton from "../../ui/buttons/checkOutGroupButton";
import { EventSchemaType } from "@/src/schemas/eventSchema";


export const renderEventDrawerContents = (
    event: EventSchemaType | null
): JSX.Element | null => {
    const permissions = useSelector((s: RootState) => s.groupMembers.accessPermissions);

    if (!event) return null
    const role = permissions[event.group_id];

    switch (role) {
        case "member":
            return (
                <>
                    <OpenedEvent
                        event={event}
                    />
                    <MembersOnlyAttendanceForm
                        role={role}
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