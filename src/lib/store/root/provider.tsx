"use client";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { initializeDomains } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useInitializeDomains } from "@/src/lib/hooks/hydration/domains/useInitializeDomains";
import { useInitializeStore } from "@/src/lib/hooks/hydration/domains/useInitializeStore";

type Props = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
  const { store, onStart, onFailure } = useInitializeStore();
  const { domains } = useInitializeDomains({ onStart, onFailure });

  useEffect(() => {
    if (!domains) return;
    store.dispatch(initializeDomains(domains));
  }, [domains, store]);

  return <Provider store={store}>{children}</Provider>;
}
