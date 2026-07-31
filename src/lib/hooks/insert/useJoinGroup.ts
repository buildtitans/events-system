"use client";
import type { AppDispatch, RootState } from "@/src/lib/store";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { JoinGroupHook } from "@/src/lib/types/hooks/types";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  enqueueSnackbar,
  showModal,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import { makeMembership } from "@/src/lib/store/slices/groups/thunks";

const useJoinGroup = (): JoinGroupHook => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = useCallback(
    async (group_id: GroupSchemaType["id"]) => {
      if (snackbar.status !== "idle") return;

      if (userKind === "anonymous") {
        dispatch(showModal("suggest join"));
        return;
      }

      dispatch(enqueueSnackbar({ kind: "joiningGroup", status: "pending" }));
      await dispatch(makeMembership(group_id));
    },
    [snackbar.status, userKind, dispatch],
  );

  return {
    handleClick,
  };
};

export { useJoinGroup };
