import type { AppDispatch } from "@/src/lib/store";
import { useDispatch } from "react-redux";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { useCallback } from "react";
import { refreshArchivedEvents } from "@/src/lib/store/slices/groups/thunks";

export const useHydrateGroupArchives = (group_id: GroupSchemaType["id"]) => {
  const dispatch = useDispatch<AppDispatch>();

  const hydrateArchivedEvents = useCallback(async () => {
    await dispatch(refreshArchivedEvents(group_id));
  }, [group_id, dispatch]);

  return { hydrateArchivedEvents };
};
