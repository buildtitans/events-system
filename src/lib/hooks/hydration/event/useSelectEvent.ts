"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  fillEventDrawer,
  getDrawerViewerRole,
  getNumAttendants,
  getNumInterested,
  getUserAttendanceStatus,
  getGroupSlug,
  getGroupName,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";

export const useSelectEvent = () => {
  const groups = useSelector((s: RootState) => s.groups.communities);
  const dispatch = useDispatch<AppDispatch>();

  function getSlugAndName(group_id: string) {
    const group = groups.find((group) => group.id === group_id);
    const slug = group?.slug;
    const name = group?.name;
    return { slug, name };
  }

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

  const handleOpenEvent = async (event_id: RsvpSchemaType["event_id"]) => {
    dispatch(enqueueDrawer("event drawer"));

    dispatch(fillEventDrawer({ status: "pending" }));

    try {
      const event = await trpcClient.events.getEvent.mutate(event_id);

      const { attendants, rsvpStatus, role } =
        await trpcClient.events.eventForDrawer.mutate(event_id);

      dispatch(fillEventDrawer({ status: "ready", data: event }));
      handleHydrationResults(
        rsvpStatus,
        attendants.going,
        attendants.interested,
        role,
      );

      const { name, slug } = getSlugAndName(event.group_id);

      if (slug) dispatch(getGroupSlug({ status: "ready", data: slug }));

      if (name) dispatch(getGroupName({ status: "ready", data: name }));
    } catch (err) {
      logCaughtError("hook/useSelectEvent.handleOpenEvent", err);
      dispatch(fillEventDrawer({ status: "failed", error: "Event not found" }));
    }
  };

  return {
    handleOpenEvent,
  };
};
