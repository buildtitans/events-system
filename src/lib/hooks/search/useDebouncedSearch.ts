"use client";
import { useState, useCallback, useRef } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import type { AutocompleteInputChangeReason } from "@mui/material/useAutocomplete";
import type { AutoCompleteOptions } from "../../store/slices/search/types";
import { compileSearchOptions } from "../../utils/helpers/search/compileSearchLookup";
import type { DebouncedSearchHook } from "../../types/hooks/types";
const WAIT_DURATION = 400;

export const useDebouncedSerach = (): DebouncedSearchHook => {
  const timerRef = useRef<number | null>(null);
  const requestIdRef = useRef<number>(0);
  const [input, setInput] = useState<string>("");

  const [suggestions, setSuggestions] = useState<AutoCompleteOptions>({
    status: "initial",
    data: [],
    message: null,
    error: null,
  });

  const sendRequest = useCallback(async (query: string) => {
    const requestId = ++requestIdRef.current;

    if (!query.trim()) {
      setSuggestions((prev: AutoCompleteOptions) => ({
        ...prev,
        status: "initial",
      }));
      return;
    }

    setSuggestions((prev: AutoCompleteOptions) => ({
      ...prev,
      status: "pending",
    }));

    try {
      const events = await trpcClient.events.search.mutate(query);
      const groups = await trpcClient.groups.searchGroups.mutate(query);

      if (requestId !== requestIdRef.current) return; // prevent commit of new state

      const lookup = compileSearchOptions(events, groups);

      if (lookup.length > 0) {
        setSuggestions((prev: AutoCompleteOptions) => ({
          ...prev,
          status: "ready",
          data: lookup,
        }));
      } else {
        setSuggestions((prev: AutoCompleteOptions) => ({
          ...prev,
          status: "n/a",
        }));
      }
    } catch {
      setSuggestions((prev: AutoCompleteOptions) => ({
        ...prev,
        status: "warning",
        error: "Unexpected error on search",
      }));
    }
  }, []);

  const debounce = useCallback(
    (query: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        sendRequest(query);
        timerRef.current = null;
      }, WAIT_DURATION);
    },
    [sendRequest],
  );

  const onInputChange = useCallback(
    (
      _event: React.SyntheticEvent,
      value: string,
      reason: AutocompleteInputChangeReason,
    ) => {
      setInput(value);

      if (reason === "input") {
        debounce(value);
      }

      if (reason === "clear") {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        setSuggestions((prev: AutoCompleteOptions) => ({
          ...prev,
          status: "initial",
        }));
      }
    },
    [debounce],
  );

  return {
    input,
    onInputChange,
    suggestions: suggestions.data,
    status: suggestions.status,
    message: suggestions.message,
    error: suggestions.error,
  };
};
