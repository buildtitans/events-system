"use client";
import { useEffect, useState } from "react";
import type { SyncDomainsResult } from "../../types/server/types";
import { syncDomains } from "@/src/lib/store/sync/syncDomains";

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
