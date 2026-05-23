"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import {
  getParticipations,
  getNextGroupEventLookup,
} from "@/src/lib/store/slices/user/userSlice";
import {
  NextGroupEventLookupMapType,
  ParticipationsStatePayload,
} from "@/src/lib/store/slices/user/types";
import { syncUserParticipations } from "@/src/lib/store/sync/syncUserParticipations";

type TrpcResults = {
  participations: ParticipationsStatePayload;
  lookup: NextGroupEventLookupMapType;
};

export const useHydrateMyRsvps = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleFailure = () => {
      dispatch(
        getParticipations({
          status: "failed",
          error: "We couldn't find the user's participation records",
        }),
      );
    };

    const handleParticipationsResults = (results: TrpcResults) => {
      const { participations, lookup } = results;
      dispatch(getNextGroupEventLookup(lookup));

      dispatch(
        getParticipations({
          status: "ready",
          data: {
            rsvps: participations.rsvps,
            memberships: participations.memberships,
          },
        }),
      );
    };

    const executeHydrateRsvps = async () => {
      dispatch(getParticipations({ status: "pending" }));

      try {
        const results = await syncUserParticipations();

        handleParticipationsResults(results);
      } catch (err) {
        console.error(err);
        handleFailure();
      }
    };

    void executeHydrateRsvps();
  }, [dispatch]);
};
