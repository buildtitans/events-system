"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/lib/store";
import { useEffect } from "react";
import {
  fillEventDrawer,
  getDrawerViewerRole,
  getGroupName,
  getGroupSlug,
  getNumAttendants,
  getNumInterested,
  getUserAttendanceStatus,
} from "../../store/slices/events/EventDrawerSlice";
import { trpcClient } from "@/src/trpc/trpcClient";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

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
      role: GroupMemberSchemaType["role"],
    ) => {
      dispatch(getDrawerViewerRole(role));
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
        const { attendants, rsvpStatus, role } =
          await trpcClient.events.eventForDrawer.mutate(event.data.id);

        handleHydrationResults(
          rsvpStatus,
          attendants.going,
          attendants.interested,
          role,
        );
      } catch (err) {
        console.error("Failed to hydrate event drawer", err);
        dispatch(
          fillEventDrawer({ status: "failed", error: "Event not found" }),
        );
      }

      const { name, slug } = getSlugAndName(event.data.group_id);

      if (slug) dispatch(getGroupSlug({ status: "ready", data: slug }));

      if (name) dispatch(getGroupName({ status: "ready", data: name }));
    };

    void executeHydrateEventDrawer();
  }, [event, dispatch, drawerActive, groups]);

  return;
};
