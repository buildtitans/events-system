import {
  AsyncThunkConfig,
  createAsyncThunk,
  GetThunkAPI,
} from "@reduxjs/toolkit";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { getCurrentRole } from "../viewer/ViewerSlice";
import { enqueueSidebar } from "../rendering/RenderingSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { HydrateOpenGroupService } from "../../services/hydrateOpenGroupService";

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
