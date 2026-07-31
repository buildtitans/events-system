import {
  AsyncThunkConfig,
  createAsyncThunk,
  GetThunkAPI,
} from "@reduxjs/toolkit";
import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { trpcClient } from "@/src/trpc/trpcClient";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import {
  enqueueAlert,
  enqueueSnackbar,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import { getUserAttendanceStatus } from "./EventDrawerSlice";

type UpdateRsvpParams = {
  event_id: EventSchemaType["id"];
  newStatus: EventAttendantsSchemaType["status"];
};

export const updateRSVP = createAsyncThunk(
  "EventSlice/updateRSVP",
  async (update: UpdateRsvpParams, thunkAPI: GetThunkAPI<AsyncThunkConfig>) => {
    thunkAPI.dispatch(
      enqueueSnackbar({ kind: "updatingAttendance", status: "pending" }),
    );

    try {
      const result = await trpcClient.eventAttendants.write.rsvp.mutate({
        event_id: update.event_id,
        newStatus: update.newStatus,
      });

      thunkAPI.dispatch(enqueueSnackbar({ kind: null, status: "idle" }));

      thunkAPI.dispatch(
        enqueueAlert({ action: "updateAttendance", kind: "success" }),
      );
      thunkAPI.dispatch(getUserAttendanceStatus(result.status));
      return result;
    } catch (err) {
      logCaughtError("EventSlice.updateRSVP()", err);
      thunkAPI.dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
      thunkAPI.dispatch(
        enqueueAlert({ action: "updateAttendance", kind: "error" }),
      );

      return thunkAPI.rejectWithValue(err);
    }
  },
);
