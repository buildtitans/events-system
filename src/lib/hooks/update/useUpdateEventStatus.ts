"use client";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { EventAttendantStatusSchemaType } from "@/src/schemas/eventAttendantsSchema";
import type { SelectChangeEvent } from "@mui/material/Select";
import { UpdateAttendanceStatusHook } from "../../types/hooks/types";
import { enqueueAlert, enqueueSnackbar } from "../../store/slices/RenderingSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import type { UpdatedAttendanceResponseSchemaType } from "@/src/schemas/eventAttendantsSchema";
import { getViewerAttendance } from "../../store/slices/events/EventDrawerSlice";

export type NewAttendanceStatus = EventAttendantStatusSchemaType | null;

export const useUpdateEventStatus = (currentStatus: EventAttendantStatusSchemaType, event_id: EventSchemaType["id"]): UpdateAttendanceStatusHook => {
    const [newStatus, setNewStatus] = useState<EventAttendantStatusSchemaType>(currentStatus);
    const timerRef = useRef<number | null>(null);
    const dispatch = useDispatch<AppDispatch>();

    const handleStatusChange = (e: SelectChangeEvent) => {
        const value = e.target.value as EventAttendantStatusSchemaType;
        setNewStatus(value);
    }

    function handleResult(result: UpdatedAttendanceResponseSchemaType) {

        timerRef.current = window.setTimeout(() => {
            dispatch(enqueueSnackbar({ kind: null, status: 'idle' }));
            dispatch(enqueueAlert({ action: "updateAttendance", kind: result ? "success" : "error" }));

            if (result) {
                dispatch(getViewerAttendance(result))
            }

            timerRef.current = null;
        }, 1200)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(enqueueSnackbar({ kind: "updatingAttendance", status: "pending" }));

        try {
            const result = await trpcClient
                .eventAttendants
                .updateViewerAttendance
                .mutate(
                    {
                        event_id: event_id,
                        newStatus: newStatus
                    }
                );
            console.log(result)

            handleResult(result);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {

        return () => {
            if (timerRef.current !== null) clearTimeout(timerRef.current);
        }
    }, [])

    return {
        newStatus,
        handleStatusChange,
        handleSubmit
    }
}