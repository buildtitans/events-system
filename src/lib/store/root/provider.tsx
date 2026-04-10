"use client";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store";
import { useEffect, useRef } from "react";
import { initializeDomains } from "../slices/rendering/RenderingSlice";
import { SyncDomainsResult } from "../../types/server/types";

type Props = {
  children: React.ReactNode;
  domains: SyncDomainsResult;
};

export default function ReduxProvider({ children, domains }: Props) {
  const storeRef = useRef<AppStore | null>(null);
const lastDomainsRef = useRef<SyncDomainsResult | null>(null);

 useEffect(() => {
    if (lastDomainsRef.current === domains) return;

    storeRef.current!.dispatch(initializeDomains(domains));
    lastDomainsRef.current = domains;
  }, [domains]);

 
  if (!storeRef.current) {
    const store = makeStore();
    store.dispatch(initializeDomains(domains));
    storeRef.current = store;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
