"use client";
import { useEffect, useState } from "react";
import type { EventSchemaType, UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { enqueueDrawer, enqueueSnackbar } from "../../store/slices/rendering/RenderingSlice";
import { CancelEventHook } from "../../types/hooks/types";
import { createScheduleNotificatoin } from "../../utils/helpers/notifications/createScheduleNotification";
import { getGroupEvents } from "../../store/slices/groups/OpenedGroupSlice";
import { wait } from "../../utils/helpers/wait";

export const useCancelEvent = (
    event: EventSchemaType,
    organizer_id: string | null | undefined

): CancelEventHook => {
    const [isUpdated, setIsUpdated] = useState<boolean>(false);
    const [options, setOptions] = useState<UpdateEventArgsSchemaType>({
        status: event.status,
        event_id: event.id,
        organizer_id: organizer_id ?? ""
    });
    const dispatch = useDispatch<AppDispatch>();

    const handleStatusChange = () => {
        setOptions((prev: UpdateEventArgsSchemaType) => ({
            ...prev,
            status: (options.status === "scheduled") ? "cancelled" : "scheduled"
        }))
    };

    function handleUpdateResult(updateStatus: "success" | "failure" | undefined): void {

        dispatch(enqueueSnackbar({
            kind: "changeEventScheduling",
            status: (updateStatus === "success")
                ? "success"
                : "failed"
        }));

        if (updateStatus === "success") dispatch(getGroupEvents({ status: 'refreshing' }));

    };


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

            await wait(1200);

            handleUpdateResult(result.updateStatus);

            if (result.updateStatus === "success") setIsUpdated(true);

            await wait(1200);

            dispatch(enqueueSnackbar({ kind: "changeEventScheduling", status: "success" }));
            dispatch(enqueueDrawer(null))

        } catch (err) {
            console.error(err);
            dispatch(enqueueSnackbar({ kind: "changeEventScheduling", status: "failed" }));
        }
    }


    useEffect(() => {
        const executeCreateNotifications = async () => {

            const notification = createScheduleNotificatoin(event, options);

            await trpcClient
                .notifications
                .createNotification
                .mutate(notification);
        }

        if (!isUpdated) return;



        void executeCreateNotifications();



    }, [isUpdated, event, options]);

    return {
        options,
        handleStatusChange,
        handleSubmit
    }
};
