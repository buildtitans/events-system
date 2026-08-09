"use client";
import type {
  EventSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import type { AppDispatch } from "@/src/lib/store";
import type { CancelEventHook } from "@/src/lib/types/hooks/types";
import { useState } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import { updateEventStatus } from "@/src/lib/store/slices/events/thunks";
import { ScheduleNotificationService } from "@/src/lib/store/services/notifications/scheduleNotificationService";
const service = new ScheduleNotificationService(trpcClient);

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

  const handleStatusChange = () => {
    setOptions((prev: UpdateEventArgsSchemaType) => ({
      ...prev,
      status: options.status === "scheduled" ? "cancelled" : "scheduled",
    }));
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();
    await dispatch(updateEventStatus(options));
    await service.createScheduleNotification(event, options);
  };

  return {
    options,
    handleStatusChange,
    handleSubmit,
  };
};
