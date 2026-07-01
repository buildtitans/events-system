"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
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
import { useCallback } from "react";

export const useSelectEvent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenEvent = useCallback(
    async (event_id: RsvpSchemaType["event_id"]) => {
      dispatch(enqueueDrawer("event drawer"));
      dispatch(fillEventDrawer({ status: "pending" }));

      try {
        const result = await trpcClient.events.eventForDrawer.mutate(event_id);

        const {
          meta: { attendants, rsvpStatus, role, name, slug },
          event,
        } = result;

        if (slug) dispatch(getGroupSlug({ status: "ready", data: slug }));

        if (name) dispatch(getGroupName({ status: "ready", data: name }));

        dispatch(fillEventDrawer({ status: "ready", data: event }));
        dispatch(getDrawerViewerRole(role));
        dispatch(getUserAttendanceStatus(rsvpStatus));
        dispatch(getNumAttendants({ status: "ready", data: attendants.going }));
        dispatch(
          getNumInterested({ status: "ready", data: attendants.interested }),
        );
      } catch (err) {
        logCaughtError("hook/useSelectEvent.handleOpenEvent", err);
        dispatch(
          fillEventDrawer({ status: "failed", error: "Event not found" }),
        );
      }
    },
    [dispatch],
  );

  return {
    handleOpenEvent,
  };
};
