import type { AppDispatch } from "@/src/lib/store";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import {
  getArchivesAttendanceRecords,
  populateGroupArchives,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { useCallback } from "react";

export const useHydrateGroupArchives = (group_id: GroupSchemaType["id"]) => {
  const dispatch = useDispatch<AppDispatch>();

  const hydrateArchivedEvents = useCallback(async () => {
    dispatch(populateGroupArchives({ status: "pending" }));
    try {
      const { archives, archivedAttendanceRecords } =
        await trpcClient.events.getArchivedGroupEvents.mutate(group_id);

      if (archives.length === 0) {
        dispatch(
          populateGroupArchives({
            status: "n/a",
            message: "This group has no archived events",
          }),
        );
        return;
      }

      dispatch(populateGroupArchives({ status: "ready", data: archives }));
      dispatch(getArchivesAttendanceRecords(archivedAttendanceRecords));
    } catch (err) {
      console.error(err);
      dispatch(
        populateGroupArchives({
          status: "failed",
          error: "Could not fetch group archives",
        }),
      );
    }
  }, [group_id, dispatch]);

  return { hydrateArchivedEvents };
};
