import { trpcClient } from "@/src/trpc/trpcClient";
import React, { useRef, useState } from "react";
import {
  AddressSuggestion,
  type AddressSearchState,
  type SearchAddressSuggestionsHook,
} from "./types";

const WAIT_DURATION = 300;

export const useSearchAddressSuggestions = (): SearchAddressSuggestionsHook => {
  const [selected, setSelected] = useState<
    AddressSuggestion["label"] | undefined
  >(undefined);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<AddressSearchState>({
    status: "initial",
  });

  const timerRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const sendRequest = async (value: string) => {
    const requestId = ++requestIdRef.current;
    const trimmed = value.trim();

    if (!trimmed) {
      setSuggestions({ status: "initial" });
      return;
    }

    setSuggestions({ status: "pending" });

    try {
      const results =
        await trpcClient.addressSearch.addressSuggestions.mutate(trimmed);

      if (requestId !== requestIdRef.current) return;

      if (results.status === "failed") {
        setSuggestions({
          status: "failed",
          error: results.message,
        });
        return;
      }

      if (results.data.length === 0) {
        setSuggestions({
          status: "n/a",
          message: "No suggestions found",
        });
        return;
      }

      setSuggestions({
        status: "ready",
        data: results.data,
      });
    } catch (err) {
      if (requestId !== requestIdRef.current) return;

      setSuggestions({
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const getInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setQuery(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!value.trim()) {
      requestIdRef.current++;
      setSuggestions({ status: "initial" });
      return;
    }

    timerRef.current = window.setTimeout(() => {
      void sendRequest(value);
      timerRef.current = null;
    }, WAIT_DURATION);
  };

  return {
    suggestions,
    getInput,
    query,
    selected,
  };
};
