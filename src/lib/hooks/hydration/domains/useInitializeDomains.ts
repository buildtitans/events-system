"use client";
import { useEffect, useState } from "react";
import { syncDomains } from "@/src/lib/store/sync/syncDomains";
import type { SyncDomainsResult } from "@/src/lib/types/server/types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

type InitializeDomainsHook = {
  domains: SyncDomainsResult | null;
};

export const useInitializeDomains = (): InitializeDomainsHook => {
  const [domains, setDomains] = useState<SyncDomainsResult | null>(null);

  useEffect(() => {
    async function executeHydrateDomains() {
      try {
        const result = await syncDomains();
        setDomains(result);
      } catch (err) {
        logCaughtError("hook/useInitializeDomains.executeHydrateDomains", err);
      }
    }

    void executeHydrateDomains();
  }, []);

  return { domains };
};
