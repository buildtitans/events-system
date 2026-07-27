"use client";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { useEffect } from "react";
import { useRefreshGroupEvents } from "@/src/lib/hooks/hydration/group/useRefreshGroupEvents";
import { useRefreshArchives } from "@/src/lib/hooks/hydration/group/useRefreshArchives";
import { hydrateGroup } from "@/src/lib/store/slices/groups/thunks";

export default function HydrateGroupBySlug({
  slug,
}: {
  slug: string;
}): React.ReactNode {
  const userKind = useSelector((s: RootState) => s.auth.userKind);
  const dispatch = useDispatch<AppDispatch>();
  useRefreshGroupEvents();
  useRefreshArchives();

  useEffect(() => {
    const executeHydration = async () => {
      await dispatch(hydrateGroup(slug));
    };
    void executeHydration();
  }, [slug, userKind, dispatch]);

  return null;
}
