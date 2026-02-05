import type { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import type { JSX } from "react";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import OpenedEvent from "../../ui/stack/OpenedEvent";
import CheckOutGroupButton from "../../ui/buttons/checkOutGroupButton";


export const renderEventDrawerContents = (
    role: GroupMembersSchemaType["role"]
): JSX.Element | null => {
    const event = useSelector((s: RootState) => s.eventDrawer.event);

    if (!event) return null;

    switch (role) {
        case "member":
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
                        role={role}
                        event={event}
                    />
                </>
            )
        }
    }

}