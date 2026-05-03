"use client";
import NewEventForm from "../../sections/forms/event/newEventForm";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import CreateEventDrawerShell from "../drawers/createEventDrawerShell";

export default function NewEventDrawerContents() {
    const group = useSelector((s: RootState) => s.openGroup.group);
    const status = group.status;
    if (status !== "ready") return null;

    return (
        <CreateEventDrawerShell
            groupName={group.data.name}
            groupLocation={group.data.location}
        >
            <NewEventForm
                group_id={group.data.id}
            />
        </CreateEventDrawerShell>
    )
}

