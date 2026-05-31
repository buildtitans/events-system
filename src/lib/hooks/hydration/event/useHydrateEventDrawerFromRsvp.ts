"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { fillEventDrawer } from "@/src/lib/store/slices/events/EventDrawerSlice";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

export const useHydrateEventDrawerFromRsvp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenEditStatus = async (event_id: RsvpSchemaType["event_id"]) => {
    dispatch(enqueueDrawer("event drawer"));

    dispatch(fillEventDrawer({ status: "pending" }));

    try {
      const event = await trpcClient.events.getEvent.mutate(event_id);

      dispatch(fillEventDrawer({ status: "ready", data: event }));
    } catch (err) {
      logCaughtError(
        "hook/useHydrateEventDrawerFromRsvp.handleOpenEditStatus",
        err,
      );
      dispatch(fillEventDrawer({ status: "failed", error: "Event not found" }));
    }
  };

  return {
    handleOpenEditStatus,
  };
};
