import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { EventSchemaType } from "@/src/schemas/eventSchema";

//TODO: create endpoint handler for creating a new event in DbClient class

export type NewEventType = {
    title: EventSchemaType["title"] | null,
    description: EventSchemaType["description"] | null,
    starts_at: EventSchemaType["starts_at"] | null,
    group_id: EventSchemaType["group_id"] | null,
    img: EventSchemaType["img"] | null
}

export const useCreateEvent = () => {
    const [newEvent, setNewEvent] = useState<NewEventType>({
        title: null,
        description: null,
        starts_at: null,
        group_id: null,
        img: null
    })


    useEffect(() => { }, [])

}