"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { createNewEventNotification } from "@/src/lib/utils/helpers/notifications/createScheduleNotification";
import { appendNewNotification } from "@/src/lib/store/slices/notifications/notificationSlice";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

export const useCreateNotifications = () => {
  const group = useSelector((s: RootState) => s.openGroup.group);
  const dispatch = useDispatch<AppDispatch>();

  const createEventScheduledNotifications = useCallback(
    async (newEvent: EventSchemaType) => {
      if (group.status !== "ready") {
        throw new Error(
          "Cannot create an event notification before the group is ready",
        );
      }

      const notification = createNewEventNotification(newEvent, group.data);

      const result =
        await trpcClient.notifications.write.create.mutate(notification);

      dispatch(
        appendNewNotification({
          status: "ready",
          data: {
            new: [result.items[0]],
            seen: [],
          },
        }),
      );
    },
    [group, dispatch],
  );

  return { createEventScheduledNotifications };
};
