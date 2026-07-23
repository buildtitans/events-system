import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  getArchivesAttendanceRecords,
  populateGroupArchives,
} from "@/src/lib/store/slices/groups/OpenedGroupSlice";
import { useEffect } from "react";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

export const useRefreshArchives = () => {
  const group = useSelector((s: RootState) => s.openGroup.group);
  const archives = useSelector((s: RootState) => s.openGroup.archives);
  const events = useSelector((s: RootState) => s.openGroup.events);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (group.status !== "ready") return;
    if (events.status !== "refreshing") return;
    if (archives.status !== "ready") return;

    const executeRefreshArchives = async () => {
      dispatch(populateGroupArchives({ status: "pending" }));

      try {
        const { archives, archivedAttendanceRecords } =
          await trpcClient.events.select.archives.query(group.data.id);

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
        logCaughtError("hook/useRefreshArchives.executeRefreshArchives", err);
        dispatch(populateGroupArchives({ status: "failed", error: `${err}` }));
      }
    };

    void executeRefreshArchives();
  }, [events.status, group, archives.status, dispatch]);
};
