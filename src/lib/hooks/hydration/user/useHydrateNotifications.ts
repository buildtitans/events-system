"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/src/lib/store";
import { hydrateNotifications } from "@/src/lib/store/slices/notifications/thunks";

export const useHydrateNotifications = () => {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userKind === "anonymous") return;

    const executeHydrateNotifications = async () => {
      await dispatch(hydrateNotifications());
    };

    void executeHydrateNotifications();
  }, [userKind, dispatch]);
};
