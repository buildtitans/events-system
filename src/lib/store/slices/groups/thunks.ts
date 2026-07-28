import {
  AsyncThunkConfig,
  createAsyncThunk,
  GetThunkAPI,
} from "@reduxjs/toolkit";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { getCurrentRole } from "../viewer/ViewerSlice";
import {
  enqueueAlert,
  enqueueDrawer,
  enqueueSidebar,
  enqueueSnackbar,
} from "../rendering/RenderingSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { HydrateOpenGroupService } from "../../services/hydrateOpenGroupService";
import { NewEventInputSchemaType } from "@/src/schemas/events/eventSchema";

export const hydrateGroup = createAsyncThunk(
  "OpenedGroup/hydrate",
  async (
    slug: GroupSchemaType["slug"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    const service = new HydrateOpenGroupService(trpcClient);

    thunkAPI.dispatch(enqueueSidebar("group"));

    try {
      const results = await service.hydrate(slug);

      if (!results.ok) {
        throw new Error("Failed to hydrate group selected");
      }

      thunkAPI.dispatch(getCurrentRole(results.data.role));

      return results.data;
    } catch (err) {
      logCaughtError("OpenedGroupSlice.hydrateGroup()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const refreshGroupEvents = createAsyncThunk(
  "OpenedGroup/refresh-events",
  async (
    id: GroupSchemaType["id"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    try {
      const refreshedEventsLayout =
        await trpcClient.events.layout.forGroup.query(id);
      const calandarEvents = await trpcClient.events.select.forGroup.query(id);

      return {
        refreshedEventsLayout,
        calandarEvents,
      };
    } catch (err) {
      logCaughtError("OpenedGroupSlice.refreshGroupEvents()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const refreshArchivedEvents = createAsyncThunk(
  "OpenedGroup/refresh-archives",
  async (
    id: GroupSchemaType["id"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    try {
      const { archives, archivedAttendanceRecords } =
        await trpcClient.events.select.archives.query(id);

      return {
        archives,
        archivedAttendanceRecords,
      };
    } catch (err) {
      logCaughtError("OpenedGroupSlice.refreshArchivedEvents()", err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const scheduleNewEvent = createAsyncThunk(
  "OpenGroup/scheduleNewEvent",
  async (
    event: NewEventInputSchemaType,
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(enqueueSnackbar({ kind: "newEvent", status: "pending" }));

    try {
      const result = await trpcClient.events.write.create.mutate(event);

      if (!result.ok) {
        throw new Error(`${result.error}`);
      }

      thunkAPI.dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
      thunkAPI.dispatch(
        enqueueAlert({ action: "createEvent", kind: "success" }),
      );
      thunkAPI.dispatch(enqueueDrawer(null));

      return result.data;
    } catch (err) {
      logCaughtError("OpenGroupSlice.scheduleNewEvent()", err);
      thunkAPI.dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
      thunkAPI.dispatch(enqueueAlert({ action: "createEvent", kind: "error" }));

      return thunkAPI.rejectWithValue(err);
    }
  },
);
