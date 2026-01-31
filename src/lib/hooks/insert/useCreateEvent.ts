import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { EventSchemaType, NewEventInputSchema } from "@/src/schemas/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { enqueueAlert, enqueueDrawer, enqueueSnackbar } from "@/src/lib/store/slices/RenderingSlice";
import { parseInputSchema } from "@/src/lib/utils/validation/parseInputSchema";
import { Dayjs } from "dayjs";
import type { PickerChangeHandlerContext, DateTimeValidationError } from "@mui/x-date-pickers";
import type { CreateEventHook } from "@/src/lib/types/hooks/types";

export type NewEventType = {
    title: EventSchemaType["title"] | null,
    description: EventSchemaType["description"] | null,
    starts_at: string | null,
    group_id: EventSchemaType["group_id"] | null,
    img: EventSchemaType["img"],
    meeting_location: EventSchemaType["meeting_location"] | null,
    authors: EventSchemaType["authors"] | null,
    tag: EventSchemaType["tag"]
};

export const useCreateEvent = (group_id: EventSchemaType["group_id"]): CreateEventHook => {
    const dispatch = useDispatch<AppDispatch>();
    const timerRef = useRef<number | null>(null);
    const [newEvent, setNewEvent] = useState<NewEventType>({
        title: null,
        description: null,
        starts_at: null,
        group_id: group_id,
        img: `https://picsum.photos/800/450?random=${Date.now()}`
        ,
        meeting_location: null,
        authors: [{ name: 'Jon Doe', avatar: 'meh' }],
        tag: null
    })


    const handleTitle = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const val = e.target.value;
        setNewEvent((prev: NewEventType) => ({
            ...prev,
            title: val
        }))
    }

    const handleLocation = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const val = e.target.value;
        setNewEvent((prev: NewEventType) => ({
            ...prev,
            meeting_location: val
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

    const handleStartsAt = (value: Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => {
        const date = value?.toISOString();
        setNewEvent((prev: NewEventType) => ({
            ...prev,
            starts_at: date ?? null
        }));
    };


    const handleScheduleResult = (result: EventSchemaType | null) => {

        timerRef.current = window.setTimeout(() => {
            dispatch(enqueueSnackbar({ kind: null, status: 'idle' }))
            dispatch(enqueueAlert({ kind: result ? 'success' : 'error', action: 'createEvent' }))
            dispatch(enqueueDrawer(null))

            timerRef.current = null;
        }, 800);
    }

    const scheduleEvent = async (newEvent: NewEventType) => {

        const parsedEvent = parseInputSchema(newEvent, NewEventInputSchema);
        return await trpcClient.events.newEvent.mutate(parsedEvent);

    }

    const schedule = async (e: React.FormEvent<HTMLFormElement>) => {
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

    return {
        schedule,
        handleTitle,
        handleDescription,
        handleStartsAt,
        handleLocation
    }
}