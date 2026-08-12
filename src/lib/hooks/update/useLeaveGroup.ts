"use client";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/lib/store";
import { RemoveUserFromGroupHook } from "@/src/lib/types/hooks/types";
import { leaveGroup } from "@/src/lib/store/slices/user/thunks";

export const useLeaveGroup = (): RemoveUserFromGroupHook => {
  const snackbarStatus = useSelector(
    (s: RootState) => s.rendering.snackbar.status,
  );
  const dispatch = useDispatch<AppDispatch>();

  const removeUserFromGroup = async (
    group_id: GroupMemberSchemaType["group_id"],
  ): Promise<void> => {
    if (snackbarStatus !== "idle") return;

    await dispatch(leaveGroup(group_id));
  };

  return {
    removeUserFromGroup,
  };
};
