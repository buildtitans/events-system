"use client";
import { useEffect } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  getParticipations,
  getNextGroupEventLookup,
} from "../../store/slices/user/userSlice";
import { wait } from "../../utils/rendering/wait";

export const useHydrateMyRsvps = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const executeHydrateRsvps = async () => {
      dispatch(getParticipations({ status: "pending" }));

      await wait(1200);

      const rsvps =
        await trpcClient.eventAttendants.getUserRsvpdEvents.mutate();

      const { memberships, nextGroupEventLookup } =
        await trpcClient.users.userMemberships.mutate();

      console.log({
        RSVPS: rsvps,
        Memberships: memberships,
      });

      dispatch(getNextGroupEventLookup(nextGroupEventLookup));

      dispatch(
        getParticipations({
          status: "ready",
          data: {
            rsvps: rsvps,
            memberships: memberships,
          },
        }),
      );
    };

    void executeHydrateRsvps();
  }, []);
};
