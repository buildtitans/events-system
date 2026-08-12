"use client";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { notifyNewEvent } from "@/src/lib/store/slices/notifications/thunks";

export const useCreateNotifications = () => {
  const group = useSelector((s: RootState) => s.openGroup.group);
  const dispatch = useDispatch<AppDispatch>();

  const createEventScheduledNotifications = useCallback(
    async (event: EventSchemaType) => {
      if (group.status !== "ready") {
        throw new Error(
          "Cannot create an event notification before the group is ready",
        );
      }

      await dispatch(notifyNewEvent({ event, group: group.data }));
    },
    [group, dispatch],
  );

  return { createEventScheduledNotifications };
};
