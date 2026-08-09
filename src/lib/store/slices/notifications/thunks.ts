import { trpcClient } from "@/src/trpc/trpcClient";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import {
  AsyncThunkConfig,
  createAsyncThunk,
  GetThunkAPI,
} from "@reduxjs/toolkit";
import { appendNewNotification } from "./notificationSlice";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { ScheduleNotificationService } from "../../services/notifications/scheduleNotificationService";
const service = new ScheduleNotificationService(trpcClient);

type NotifyNewEventParams = {
  event: EventSchemaType;
  group: GroupSchemaType;
};

export const notifyNewEvent = createAsyncThunk(
  "NotificationSlice/notifyNewEvent",
  async (
    params: NotifyNewEventParams,
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    try {
      const result = await service.createNewEventNotification(
        params.event,
        params.group,
      );

      thunkAPI.dispatch(
        appendNewNotification({
          status: "ready",
          data: {
            new: [result.items[0]],
            seen: [],
          },
        }),
      );

      return result;
    } catch (err) {
      logCaughtError("NotificationSlice.notifyNewEvent()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);
