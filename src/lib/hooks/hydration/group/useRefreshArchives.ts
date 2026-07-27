import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { useEffect } from "react";
import { refreshArchivedEvents } from "@/src/lib/store/slices/groups/thunks";

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
      dispatch(refreshArchivedEvents(group.data.id));
    };

    void executeRefreshArchives();
  }, [events.status, group, archives.status, dispatch]);
};
