"use client";
import { useRecoverSession } from "@/src/lib/hooks/auth/useRecoverSession";
import { useHydrateNotifications } from "@/src/lib/hooks/hydration/useHydrateNotifications";

export default function SessionHydrator(): React.ReactNode {
  useRecoverSession();
  useHydrateNotifications();
  return null;
}
