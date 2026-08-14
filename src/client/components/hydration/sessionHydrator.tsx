"use client";
import { useRecoverSession } from "@/src/lib/hooks/auth/session/useRecoverSession";
import { useHydrateNotifications } from "@/src/lib/hooks/hydration/user/useHydrateNotifications";
import { useRefreshNotifications } from "@/src/lib/hooks/update/notifications/useRefreshNotifications";

export default function SessionHydrator(): React.ReactNode {
  useRecoverSession();
  useHydrateNotifications();
  useRefreshNotifications();
  return null;
}
