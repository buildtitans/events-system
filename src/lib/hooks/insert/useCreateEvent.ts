import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { EventSchemaType, NewEventInputSchema } from "@/src/schemas/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { enqueueSnackbar } from "@/src/lib/store/slices/RenderingSlice";
import { parseInputSchema } from "@/src/lib/utils/validation/parseInputSchema";

//TODO: create group dynamic route to pass group_id to the hook

export type NewEventType = {
    title: EventSchemaType["title"] | null,
    description: EventSchemaType["description"] | null,
    starts_at: EventSchemaType["starts_at"] | null,
    group_id: EventSchemaType["group_id"] | null,
    img: EventSchemaType["img"] | null
}

export const useCreateEvent = (group_id: EventSchemaType["group_id"]) => {
    const dispatch = useDispatch<AppDispatch>();
    const timerRef = useRef<number | null>(null);
    const [newEvent, setNewEvent] = useState<NewEventType>({
        title: null,
        description: null,
        starts_at: null,
        group_id: group_id,
        img: null
    })


    const handleTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const val = e.target.value;
        setNewEvent((prev: NewEventType) => ({
            ...prev,
            title: val
        }))
    }

    const handleDescription = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const val = e.target.value;
        setNewEvent((prev: NewEventType) => ({
            ...prev,
            description: val
        }));
    };

    const handleStartsAt = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNewEvent((prev: NewEventType) => ({
            ...prev,
            starts_at: val
        }));
    };


    const handleScheduleResult = (result: EventSchemaType | null) => {
        timerRef.current = window.setTimeout(() => {
            dispatch(enqueueSnackbar({ kind: 'newEvent', status: result ? 'success' : 'failed' }))
            timerRef.current = null;
        }, 1200);
    }

    const scheduleEvent = async (newEvent: NewEventType) => {

        const parsedEvent = parseInputSchema(newEvent, NewEventInputSchema);
        return await trpcClient.events.newEvent.mutate(parsedEvent);

    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(enqueueSnackbar({ kind: 'newEvent', status: 'pending' }))
        const result = await scheduleEvent(newEvent);
        handleScheduleResult(result);
    }

    useEffect(() => {

        return () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
        }
    }, []);

    return { handleSubmit, handleTitle, handleDescription, handleStartsAt }
}