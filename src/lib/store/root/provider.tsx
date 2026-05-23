"use client";
import { Provider } from "react-redux";
import { makeStore } from "@/src/lib/store/root/store";
import { useEffect, useState } from "react";
import { initializeDomains } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useInitializeDomains } from "@/src/lib/hooks/hydration/domains/useInitializeDomains";

type Props = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
  const { domains } = useInitializeDomains();
  const [store] = useState(() => makeStore());

  useEffect(() => {
    if (!domains) return;
    store.dispatch(initializeDomains(domains));
  }, [domains, store]);

  return <Provider store={store}>{children}</Provider>;
}
