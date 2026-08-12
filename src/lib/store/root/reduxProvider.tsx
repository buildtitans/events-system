"use client";
import { Provider } from "react-redux";
import { JSX, useEffect } from "react";
import { initializeDomains } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { useInitializeDomains } from "@/src/lib/hooks/hydration/domains/useInitializeDomains";
import { useInitializeStore } from "@/src/lib/hooks/hydration/domains/useInitializeStore";

type Props = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props): JSX.Element {
  const { store, onStart, onFailure } = useInitializeStore();
  const { syncResult } = useInitializeDomains({ onStart, onFailure });

  useEffect(() => {
    if (!syncResult) return;
    store.dispatch(initializeDomains(syncResult));
  }, [syncResult, store]);

  return <Provider store={store}>{children}</Provider>;
}
