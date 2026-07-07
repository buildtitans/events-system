"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  enqueueSnackbar,
  showModal,
} from "../../store/slices/rendering/RenderingSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { getCurrentRole } from "../../store/slices/viewer/ViewerSlice";
import { JoinGroupHook } from "../../types/hooks/types";
import { logCaughtError } from "../../utils/errors/logCaughtError";
import { useCallback } from "react";

const useJoinGroup = (): JoinGroupHook => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
  const dispatch = useDispatch<AppDispatch>();

  const joinGroup = useCallback(
    async (group_id: GroupSchemaType["id"]) => {
      try {
        const res = await trpcClient.groupMembers.write.join.mutate(group_id);
        dispatch(enqueueSnackbar({ kind: "joiningGroup", status: "success" }));
        dispatch(getCurrentRole(res.role));
        return;
      } catch (err) {
        logCaughtError("useJoinGroup.handleClick.joinGroup()", err);
        dispatch(enqueueSnackbar({ kind: "joiningGroup", status: "failed" }));
        dispatch(getCurrentRole("anonymous"));
        return;
      }
    },
    [dispatch],
  );

  const handleClick = useCallback(
    async (group_id: GroupSchemaType["id"]) => {
      if (snackbar.status !== "idle") return;

      if (userKind === "anonymous") {
        dispatch(showModal("suggest join"));
        return;
      }

      dispatch(enqueueSnackbar({ kind: "joiningGroup", status: "pending" }));
      await joinGroup(group_id);
    },
    [snackbar.status, userKind, dispatch, joinGroup],
  );

  return {
    handleClick,
  };
};

export { useJoinGroup };
