"use client";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "./store";
import { useEffect, useRef } from "react";
import { initializeDomains } from "../slices/rendering/RenderingSlice";
import { useInitializeDomains } from "../../hooks/hydration/useInitializeDomains";

type Props = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Props) {
  const { domains } = useInitializeDomains();
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (!domains) return;
    storeRef.current!.dispatch(initializeDomains(domains));
  }, [domains]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
