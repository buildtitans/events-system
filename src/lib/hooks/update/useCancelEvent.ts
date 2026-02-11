"use client";
import { useEffect, useRef, useState } from "react";
import type { EventSchemaType, UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { enqueueDrawer, enqueueSnackbar } from "../../store/slices/rendering/RenderingSlice";
import { CancelEventHook } from "../../types/hooks/types";


export const useCancelEvent = (
    event: EventSchemaType,
    organizer_id: string | null | undefined

): CancelEventHook => {
    const [options, setOptions] = useState<UpdateEventArgsSchemaType>({
        status: event.status,
        event_id: event.id,
        organizer_id: organizer_id ?? ""
    });

    const timerRef = useRef<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const handleStatusChange = () => {
        setOptions((prev: UpdateEventArgsSchemaType) => ({
            ...prev,
            status: (options.status === "scheduled") ? "cancelled" : "scheduled"
        }))
    };

    function handleUpdateResult(updateStatus: "success" | "failure" | undefined): void {



        timerRef.current = window.setTimeout(() => {
            dispatch(enqueueSnackbar({
                kind: "changeEventScheduling",
                status: (updateStatus === "success")
                    ? "success"
                    : "failed"
            }));
            dispatch(enqueueDrawer(null))
            timerRef.current = null;
        }, 1200)

    }


    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
        e.preventDefault();
        dispatch(enqueueSnackbar({ kind: "changeEventScheduling", status: "pending" }))

        try {
            const result = await trpcClient.events.updateEventStatus.mutate(options);

            if (!result?.updateStatus) {
                throw new Error(`Error attempting to cancel event`);
            }

            handleUpdateResult(result.updateStatus);


            timerRef.current = window.setTimeout(() => {
                dispatch(enqueueSnackbar({ kind: "changeEventScheduling", status: "success" }));
                dispatch(enqueueDrawer(null))
                timerRef.current = null;
            }, 1200)

        } catch (err) {
            console.error(err);
            dispatch(enqueueSnackbar({ kind: "changeEventScheduling", status: "failed" }));
        }
    }


    useEffect(() => {

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [])

    return {
        options,
        handleStatusChange,
        handleSubmit
    }
};
