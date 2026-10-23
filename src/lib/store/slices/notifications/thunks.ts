import { trpcClient } from "@/src/trpc/trpcClient";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import type { NewAndSeenNotifications } from "./types";
import {
  AsyncThunkConfig,
  createAsyncThunk,
  GetThunkAPI,
} from "@reduxjs/toolkit";
import { appendNewNotification, markSeen } from "./notificationSlice";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { ScheduleNotificationService } from "@/src/lib/store/services/notifications/scheduleNotificationService";
const service = new ScheduleNotificationService(trpcClient);

type NotifyNewEventParams = {
  event: EventSchemaType;
  group: GroupSchemaType;
};

export const hydrateNotifications = createAsyncThunk(
  "NotificationSlice/hydrateNotifications",
  async (_, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      return await trpcClient.entities.notifications.select.newAndViewed.query();
    } catch (err) {
      logCaughtError("NotificationSlice.hydrateNotifications()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const notifyNewEvent = createAsyncThunk(
  "NotificationSlice/notifyNewEvent",
  async (
    params: NotifyNewEventParams,
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    try {
      const notification = await service.createNewEventNotification(
        params.event,
        params.group,
      );

      if (!notification) {
        throw new Error(
          `Failed to create new event notification for ${params.event.title}`,
        );
      }

      thunkAPI.dispatch(appendNewNotification(notification));
    } catch (err) {
      logCaughtError("NotificationSlice.notifyNewEvent()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const refreshNotifications = createAsyncThunk(
  "NotificationSlice/refreshNotifications",
  async (_, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    try {
      return await trpcClient.entities.notifications.select.newAndViewed.query();
    } catch (err) {
      logCaughtError("NotificationSlice/refreshNotifications", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const markOpenedNotifications = createAsyncThunk(
  "UserSlice/markOpenedNotifications",
  async (
    newNotifications: NewAndSeenNotifications["new"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    const ids = newNotifications.map((notification) => notification.data.id);
    try {
      const result =
        await trpcClient.entities.notifications.write.markOpened.mutate(ids);

      if (!result.ok) {
        throw new Error("Failed to mark opened notifications");
      }

      thunkAPI.dispatch(markSeen());

      return result;
    } catch (err) {
      logCaughtError("UserSlice.markOpenedNotifications()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);
