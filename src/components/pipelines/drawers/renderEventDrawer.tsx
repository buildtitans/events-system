import type { JSX } from "react";
import MembersOnlyAttendanceForm from "../../sections/events/membersOnlyAttendanceForm";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import OpenedEvent from "../../ui/stack/OpenedEvent";
import CheckOutGroupButton from "../../ui/buttons/checkOutGroupButton";


export const renderEventDrawerContents = (
): JSX.Element | null => {
    const event = useSelector((s: RootState) => s.eventDrawer.event);
    const role = useSelector((s: RootState) => s.groupMembers.accessPermissions[event?.group_id ?? ""]);

    if (!event) return null;

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