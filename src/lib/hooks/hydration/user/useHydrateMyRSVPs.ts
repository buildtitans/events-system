"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import {
  getParticipations,
  getNextGroupEventLookup,
  getMemberships,
} from "@/src/lib/store/slices/user/userSlice";
import {
  NextGroupEventLookupMapType,
  ParticipationsStatePayload,
} from "@/src/lib/store/slices/user/types";
import { syncUserParticipations } from "@/src/lib/store/sync/syncUserParticipations";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

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

      if (participations.memberships.length > 0) {
        dispatch(
          getMemberships({ status: "ready", data: participations.memberships }),
        );
      } else {
        dispatch(
          getMemberships({
            status: "n/a",
            message: "No records of any memberships",
          }),
        );
      }

      if (participations.rsvps.length > 0) {
        dispatch(
          getParticipations({
            status: "ready",
            data: participations.rsvps,
          }),
        );
      } else {
        dispatch(
          getParticipations({
            status: "n/a",
            message: "We couldn't find any records of user participations",
          }),
        );
      }
    };

    const executeHydrateRsvps = async () => {
      dispatch(getParticipations({ status: "pending" }));
      dispatch(getMemberships({ status: "pending" }));

      try {
        const results = await syncUserParticipations();

        handleParticipationsResults(results);
      } catch (err) {
        logCaughtError("hook/useHydrateMyRsvps.executeHydrateRsvps", err);
        handleFailure();
      }
    };

    void executeHydrateRsvps();
  }, [dispatch]);
};
