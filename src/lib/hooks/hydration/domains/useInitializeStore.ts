"use client";
import { useState, useCallback } from "react";
import { AppStore, makeStore } from "@/src/lib/store/root/store";
import { signalDomainStatus } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { AppBootState } from "@/src/lib/types/state/types";

const failurePayload: Extract<AppBootState, { status: "failed" }> = {
  status: "failed",
  error: "INITIAL_DOMAIN_SYNC_FAILED",
  message: "The app could not load its required startup data",
};

const pendingPayload: Extract<AppBootState, { status: "pending" }> = {
  status: "pending",
};

type InitializeStoreHook = {
  store: AppStore;
  onStart: () => void;
  onFailure: () => void;
};

export const useInitializeStore = (): InitializeStoreHook => {
  const [store] = useState(() => makeStore());

  const onStart = useCallback(() => {
    store.dispatch(signalDomainStatus(pendingPayload));
  }, [store]);
  const onFailure = useCallback(() => {
    store.dispatch(signalDomainStatus(failurePayload));
  }, [store]);

  return { store, onStart, onFailure };
};
