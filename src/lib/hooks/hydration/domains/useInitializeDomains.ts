"use client";
import { useEffect, useState } from "react";
import type { SyncDomainsType } from "@/src/lib/types/server/types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { trpcClient } from "@/src/trpc/trpcClient";

type InitializeDomainsHook = {
  syncResult: SyncDomainsType | null;
};

type InitializeDomainsCallbacks = {
  onStart: () => void;
  onFailure: () => void;
};

export const useInitializeDomains = ({
  onFailure,
  onStart,
}: InitializeDomainsCallbacks): InitializeDomainsHook => {
  const [syncResult, setSyncResult] = useState<SyncDomainsType | null>(null);

  useEffect(() => {
    async function executeHydrateDomains() {
      try {
        onStart();
        const result = await trpcClient.hydrate.app.query();

        setSyncResult({
          status: "fulfilled",
          data: {
            events: result.events,
            groups: result.groups,
            categories: result.categories,
          },
        });
      } catch (err) {
        logCaughtError(
          "hook/useInitializeDomains.executeHydrateDomains.SyncDomainsService.sync()",
          err,
        );
        onFailure();
      }
    }

    void executeHydrateDomains();
  }, [onFailure, onStart]);

  return { syncResult };
};
