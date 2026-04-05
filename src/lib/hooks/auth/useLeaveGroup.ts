"use client";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { enqueueSnackbar } from "../../store/slices/rendering/RenderingSlice";
import { RemoveUserFromGroupHook } from "../../types/hooks/types";
import { getCurrentRole } from "../../store/slices/viewer/ViewerSlice";

export const useLeaveGroup = (): RemoveUserFromGroupHook => {
  const snackbarStatus = useSelector(
    (s: RootState) => s.rendering.snackbar.status,
  );
  const dispatch = useDispatch<AppDispatch>();

  const removeUserFromGroup = async (
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<void> => {
    if (snackbarStatus !== "idle") return;
    dispatch(enqueueSnackbar({ kind: "leaveGroup", status: "pending" }));

    try {
      const result = await trpcClient.groupMembers.leaveGroup.mutate({
        group_id,
      });

      dispatch(
        enqueueSnackbar({
          kind: "leaveGroup",
          status: result === true ? "success" : "failed",
        }),
      );

      if (result) {
        dispatch(getCurrentRole("anonymous"));
      }
    } catch (err) {
      dispatch(enqueueSnackbar({ kind: "leaveGroup", status: "failed" }));
      console.error(err);
    }
  };

  return {
    removeUserFromGroup,
  };
};
