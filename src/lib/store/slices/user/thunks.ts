import type { GetThunkAPI, AsyncThunkConfig } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { trpcClient } from "@/src/trpc/trpcClient";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { enqueueAlert, enqueueSnackbar } from "../rendering/RenderingSlice";
import { wait } from "@/src/lib/utils/rendering/wait";

export const leaveGroup = createAsyncThunk(
  "UserSlice/leaveGroup",
  async (
    group_id: GroupSchemaType["id"],
    thunkAPI: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    thunkAPI.dispatch(
      enqueueSnackbar({ kind: "leaveGroup", status: "pending" }),
    );

    try {
      const successful = await trpcClient.groupMembers.write.leave.mutate({
        group_id,
      });

      if (!successful) {
        throw new Error(`Failed to leave group with group_id: ${group_id}`);
      }

      await wait(600);
      thunkAPI.dispatch(
        enqueueAlert({ action: "leaveGroup", kind: "success" }),
      );
    } catch (err) {
      logCaughtError("UserSlice.leaveGroup()", err);
      thunkAPI.dispatch(enqueueAlert({ action: "leaveGroup", kind: "error" }));
      return thunkAPI.rejectWithValue(err);
    }
  },
);
