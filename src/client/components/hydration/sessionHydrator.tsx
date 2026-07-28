"use client";
import { useRecoverSession } from "@/src/lib/hooks/auth/session/useRecoverSession";
import { useHydrateNotifications } from "@/src/lib/hooks/hydration/user/useHydrateNotifications";

export default function SessionHydrator(): React.ReactNode {
  useRecoverSession();
  useHydrateNotifications();
  return null;
}
