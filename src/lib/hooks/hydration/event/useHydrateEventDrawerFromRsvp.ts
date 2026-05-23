"use client";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { fillEventDrawer } from "@/src/lib/store/slices/events/EventDrawerSlice";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";

export const useHydrateEventDrawerFromRsvp = () => {
  const dispatch = useDispatch<AppDispatch>();

  const getRsvpEvent = async (event_id: RsvpSchemaType["event_id"]) => {
    return await trpcClient.events.getEvent.mutate(event_id);
  };

  const handleOpenEditStatus = async (event_id: RsvpSchemaType["event_id"]) => {
    dispatch(enqueueDrawer("event drawer"));

    dispatch(fillEventDrawer({ status: "pending" }));

    const event = await getRsvpEvent(event_id);

    if (event) {
      dispatch(fillEventDrawer({ status: "ready", data: event }));
    } else {
      dispatch(fillEventDrawer({ status: "failed", error: "Event not found" }));
    }
  };

  return {
    handleOpenEditStatus,
  };
};
