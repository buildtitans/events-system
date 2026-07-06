"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { hydrateEventDrawer } from "@/src/lib/store/slices/events/EventDrawerSlice";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import { useCallback } from "react";

export const useSelectEvent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenEvent = useCallback(
    async (event_id: RsvpSchemaType["event_id"]) => {
      await dispatch(hydrateEventDrawer(event_id));
    },
    [dispatch],
  );

  return {
    handleOpenEvent,
  };
};
