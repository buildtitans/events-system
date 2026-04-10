"use client";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/src/lib/store";
import { signalDomainStatus } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useEffect } from "react";
import { useRecoverSession } from "@/src/lib/hooks/auth/useRecoverSession";
import { useHydrateNotifications } from "@/src/lib/hooks/hydration/useHydrateNotifications";

export default function SessionHydrator(): React.ReactNode {
  useRecoverSession();
  useHydrateNotifications();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
      dispatch(signalDomainStatus("idle"));
  }, [dispatch]);

  return null;
}
