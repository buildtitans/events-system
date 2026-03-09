"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { useEffect } from "react";
import {
  getDrawerViewerRole,
  getGroupName,
  getGroupSlug,
  getNumAttendants,
  getNumInterested,
  getUserAttendanceStatus,
} from "../../store/slices/events/EventDrawerSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { GroupMembersSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

export const useHydrateEventDrawer = () => {
  const drawerActive = useSelector((s: RootState) => s.rendering.drawer);
  const event = useSelector((s: RootState) => s.eventDrawer.event);
  const groups = useSelector((s: RootState) => s.groups.communities);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (event.status !== "ready") return;
    if (drawerActive !== "event drawer") return;

    const handleHydrationResults = (
      currentUserStatus: EventAttendantsSchemaType["status"],
      numGoing: number,
      numInterested: number,
    ) => {
      dispatch(getUserAttendanceStatus(currentUserStatus));
      dispatch(getNumAttendants({ status: "ready", data: numGoing }));
      dispatch(getNumInterested({ status: "ready", data: numInterested }));
    };

    function getSlugAndName(group_id: string) {
      const group = groups.find((group) => group.id === group_id);
      const slug = group?.slug;
      const name = group?.name;
      return { slug, name };
    }

    const executeHydrateEventDrawer = async () => {
      try {
        const { currentUserStatus, numGoing, numInterested } =
          await trpcClient.eventAttendants.getViewerAttendance.mutate(
            event.data.id,
          );

        handleHydrationResults(currentUserStatus, numGoing, numInterested);
      } catch (err) {}

      const { name, slug } = getSlugAndName(event.data.group_id);

      if (slug) dispatch(getGroupSlug({ status: "ready", data: slug }));

      if (name) dispatch(getGroupName({ status: "ready", data: name }));
    };

    void executeHydrateEventDrawer();
  }, [event, dispatch, drawerActive, groups]);

  return;
};
