"use client";
import { useState } from "react";
import type {
  EventSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  enqueueDrawer,
  enqueueSnackbar,
} from "../../store/slices/rendering/RenderingSlice";
import { CancelEventHook } from "../../types/hooks/types";
import { createScheduleNotification } from "../../utils/helpers/notifications/createScheduleNotification";
import { getGroupEvents } from "../../store/slices/groups/OpenedGroupSlice";

export const useCancelEvent = (
  event: EventSchemaType,
  organizer_id: string | null | undefined,
): CancelEventHook => {
  const [options, setOptions] = useState<UpdateEventArgsSchemaType>({
    status: event.status,
    event_id: event.id,
    group_id: event.group_id,
    organizer_id: organizer_id ?? "",
  });
  const dispatch = useDispatch<AppDispatch>();

  async function executeCreateNotifications(): Promise<void> {
    const notification = createScheduleNotification(event, options);

    await trpcClient.notifications.createNotification.mutate(notification);
  }

  const handleStatusChange = () => {
    setOptions((prev: UpdateEventArgsSchemaType) => ({
      ...prev,
      status: options.status === "scheduled" ? "cancelled" : "scheduled",
    }));
  };

  async function handleUpdateResult(
    updateStatus: "success" | "failure" | undefined,
  ): Promise<void> {
    if (updateStatus === "success") {
      void executeCreateNotifications();

      dispatch(
        enqueueSnackbar({
          kind: "changeEventScheduling",
          status: "success",
        }),
      );

      dispatch(getGroupEvents({ status: "refreshing" }));
    } else {
      dispatch(
        enqueueSnackbar({
          kind: "changeEventScheduling",
          status: "failed",
        }),
      );
    }
  }

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();
    dispatch(
      enqueueSnackbar({ kind: "changeEventScheduling", status: "pending" }),
    );

    try {
      const result = await trpcClient.events.updateEventStatus.mutate(options);
      if (!result?.updateStatus) {
        throw new Error(`Error attempting to cancel event`);
      }
      handleUpdateResult(result.updateStatus);
      dispatch(
        enqueueSnackbar({ kind: "changeEventScheduling", status: "success" }),
      );
      dispatch(enqueueDrawer(null));
    } catch (err) {
      console.error(err);
      dispatch(
        enqueueSnackbar({ kind: "changeEventScheduling", status: "failed" }),
      );
    }
  };

  return {
    options,
    handleStatusChange,
    handleSubmit,
  };
};
