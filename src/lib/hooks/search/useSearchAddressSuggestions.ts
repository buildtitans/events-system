import { trpcClient } from "@/src/trpc/trpcClient";
import React, { useCallback, useRef, useState } from "react";
import {
  type AddressSuggestion,
  type AddressSearchState,
  type SearchAddressSuggestionsHook,
} from "./types";
import { CreateEventHook } from "../../types/hooks/types";
import type {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/useAutocomplete";

const WAIT_DURATION = 300;

export const useSearchAddressSuggestions = (
  handleLocation: CreateEventHook["handleLocation"],
): SearchAddressSuggestionsHook => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<AddressSearchState>({
    status: "initial",
  });

  console.log(suggestions);

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

  const debounce = useCallback(
    async (query: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        void sendRequest(query);
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
      if (reason === "input") {
        setQuery(value);
        debounce(value);
      }

      if (reason === "clear") {
        setQuery("");
        handleLocation("");
        requestIdRef.current++;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setSuggestions((prev: AddressSearchState) => ({
          ...prev,
          status: "initial",
        }));
      }
    },
    [debounce, handleLocation],
  );

  const selectAddressOption = useCallback(
    (
      _event: React.SyntheticEvent,
      value: AddressSuggestion | null,
      reason: AutocompleteChangeReason,
    ) => {
      if (reason === "selectOption" && value?.label) {
        const address = value.label;
        setQuery(value.label);
        handleLocation(address);
        setSuggestions({ status: "initial" });
      }
    },
    [handleLocation],
  );

  const selectOption = (option: AddressSuggestion) => {
    handleLocation(option.label);
    setSuggestions({ status: "initial" });
  };

  return {
    suggestions,
    query,
    selectOption,
    selectAddressOption,
    onInputChange,
  };
};
