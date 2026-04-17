"use client";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { useEffect, useState } from "react";
import { initializeDomains } from "../slices/rendering/RenderingSlice";
import { useInitializeDomains } from "../../hooks/hydration/useInitializeDomains";

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
