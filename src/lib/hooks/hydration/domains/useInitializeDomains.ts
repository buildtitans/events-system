"use client";
import { useEffect, useState } from "react";
import type { SyncDomainsType } from "@/src/lib/types/server/types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { SyncDomainsService } from "@/src/lib/store/sync/syncDomainService";
import { trpcClient } from "@/src/trpc/trpcClient";

type InitializeDomainsHook = {
  domains: SyncDomainsType | null;
};

type InitializeDomainsCallbacks = {
  onStart: () => void;
  onFailure: () => void;
};

export const useInitializeDomains = ({
  onFailure,
  onStart,
}: InitializeDomainsCallbacks): InitializeDomainsHook => {
  const [domains, setDomains] = useState<SyncDomainsType | null>(null);

  useEffect(() => {
    async function executeHydrateDomains() {
      try {
        onStart();
        const service = new SyncDomainsService(trpcClient);
        const result = await service.sync();
        setDomains(result);
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

  return { domains };
};
