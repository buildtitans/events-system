"use client";
import { useEffect, useState } from "react";
import { syncDomains } from "@/src/lib/store/sync/syncDomains";
import type { SyncDomainsResult } from "@/src/lib/types/server/types";

type InitializeDomainsHook = {
  domains: SyncDomainsResult | null;
};

export const useInitializeDomains = (): InitializeDomainsHook => {
  const [domains, setDomains] = useState<SyncDomainsResult | null>(null);

  useEffect(() => {
    async function executeHydrateDomains() {
      const result = await syncDomains();
      setDomains(result);
    }

    void executeHydrateDomains();
  }, []);

  return { domains };
};
