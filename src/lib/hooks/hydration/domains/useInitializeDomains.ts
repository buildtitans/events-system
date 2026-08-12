"use client";
import { useEffect, useState } from "react";
import type { SyncDomainsType } from "@/src/lib/types/server/types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { SyncDomainsService } from "@/src/lib/store/services/hydration/syncDomainService";
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
        const service = new SyncDomainsService(trpcClient);
        const result = await service.sync();

        if (result.status === "rejected") {
          onFailure();
        }

        setSyncResult(result);
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
