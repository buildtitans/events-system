"use client";
import { useEffect, useState } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";

//TODO: once rendered, split RSVPS by 'past' | 'going' | 'interested'

export const useHydrateMyRsvps = () => {
  const [rsvpdEvents, setRsvpdEvents] = useState<EventsArraySchemaType>([]);

  useEffect(() => {
    const executeHydrateRsvps = async () => {
      const result =
        await trpcClient.eventAttendants.getUserRsvpdEvents.mutate();

      setRsvpdEvents(result);
    };

    void executeHydrateRsvps();
  }, []);

  return {
    rsvpdEvents,
  };
};
