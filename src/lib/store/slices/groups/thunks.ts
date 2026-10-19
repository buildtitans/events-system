import {
  AsyncThunkConfig,
  createAsyncThunk,
  GetThunkAPI,
} from "@reduxjs/toolkit";
import {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { getCurrentRole } from "../viewer/ViewerSlice";
import {
  enqueueAlert,
  enqueueDrawer,
  enqueueSidebar,
  enqueueSnackbar,
} from "../rendering/RenderingSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { HydrateOpenGroupService } from "../../services/hydration/hydrateOpenGroupService";
import { NewEventInputSchemaType } from "@/src/schemas/events/eventSchema";
import { addGroup } from "./GroupsSlice";
import { getGroupHistory, populateGroupArchives } from "./OpenedGroupSlice";
import { sortByDate } from "@/src/lib/utils/helpers/sort/sortByDate";

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

export const hydrateGroupHistory = createAsyncThunk(
  "OpenedGroupSlice/hydrageGroupHistory",
  async (
    id: GroupSchemaType["id"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(getGroupHistory({ status: "pending" }));

    try {
      const result = await trpcClient.entities.group.events.history.query(id);

      if (result.length > 0) {
        const sorted = sortByDate(result);
        thunkAPI.dispatch(getGroupHistory({ status: "ready", data: sorted }));
      } else {
        thunkAPI.dispatch(
          getGroupHistory({ status: "n/a", message: "No history to display" }),
        );
      }
    } catch (err) {
      logCaughtError("OpenedGroupSlice.hydrageGroupHistory()", err);
      thunkAPI.dispatch(
        getGroupHistory({
          status: "failed",
          error: "Failed to hydrate group history",
        }),
      );
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
        await trpcClient.hydrate.events.layouts.forGroup.query(id);
      const calandarEvents = await trpcClient.entities.group.events.list.query(id);
      const nextEvent = await trpcClient.entities.group.events.nextEvent.query(id);
      return {
        refreshedEventsLayout,
        calandarEvents,
        nextEvent,
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
    thunkAPI.dispatch(populateGroupArchives({ status: "pending" }));

    try {
      const result = await trpcClient.entities.group.organizer.archives.query(id);

      return result;
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
      const result =
        await trpcClient.entities.group.organizer.newEvent.mutate(event);

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

export const createGroup = createAsyncThunk(
  "OpenGroupSlice/createGroup",
  async (
    group: NewGroupInputSchemaType,
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(enqueueSnackbar({ kind: "newGroup", status: "pending" }));

    try {
      const result =
        await trpcClient.entities.group.organizer.newGroup.mutate(group);
      if (!result.ok) {
        throw new Error(result.error);
      }
      thunkAPI.dispatch(addGroup(result.data));
      thunkAPI.dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
      thunkAPI.dispatch(
        enqueueAlert({ kind: "success", action: "createGroup" }),
      );
      thunkAPI.dispatch(enqueueDrawer(null));
      return result;
    } catch (err) {
      logCaughtError("OpenGroupSlice.createGroup()", err);
      thunkAPI.dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
      thunkAPI.dispatch(enqueueAlert({ kind: "error", action: "createGroup" }));
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const makeMembership = createAsyncThunk(
  "OpenGroupSlice/makeMembership",
  async (
    group_id: GroupSchemaType["id"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(
      enqueueSnackbar({ kind: "joiningGroup", status: "pending" }),
    );

    try {
      const result = await trpcClient.entities.group.member.joinGroup.mutate(group_id);
      thunkAPI.dispatch(
        enqueueSnackbar({ kind: "joiningGroup", status: "success" }),
      );
      thunkAPI.dispatch(getCurrentRole(result.role));
      return result;
    } catch (err) {
      logCaughtError("OpenGroupSlice.makeMembership()", err);
      thunkAPI.dispatch(
        enqueueSnackbar({ kind: "joiningGroup", status: "failed" }),
      );
      thunkAPI.dispatch(getCurrentRole("anonymous"));
      return thunkAPI.rejectWithValue(err);
    }
  },
);
