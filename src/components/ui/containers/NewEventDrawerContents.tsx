"use client";
import NewEventForm from "../../sections/forms/newEventForm";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export default function NewEventDrawerContents() {
    const group = useSelector((s: RootState) => s.openGroup.group);
    const status = group.status;
    if (status !== "ready") return null;

    return (
        <NewEventForm
            group_id={group.data.id}
        />
    )
}

