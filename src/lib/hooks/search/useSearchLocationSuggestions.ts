import React, { useCallback, useEffect, useRef, useState } from "react";
import type {
  AddressSuggestion,
  AddressSearchState,
  SearchAddressSuggestionsHook,
} from "./types";
import { CreateEventHook } from "../../types/hooks/types";
import type {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/useAutocomplete";
import { logCaughtError } from "../../utils/errors/logCaughtError";
import { searchByAddressKind } from "../../utils/helpers/search/searchByAddressKind";

const WAIT_DURATION = 300;

export const useSearchLocationSuggestions = (
  handleLocation: CreateEventHook["handleLocation"],
  searchKind: "city" | "street" = "street",
): SearchAddressSuggestionsHook => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<AddressSearchState>({
    status: "initial",
  });

  const timerRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const sendRequest = useCallback(
    async (value: string) => {
      const requestId = ++requestIdRef.current;
      const trimmed = value.trim();

      if (!trimmed) {
        setSuggestions({ status: "initial" });
        return;
      }

      setSuggestions({ status: "pending" });

      try {
        const results = await searchByAddressKind(searchKind, trimmed);
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

        logCaughtError("hook/useSearchLocationSuggestions.sendRequest", err);
        setSuggestions({
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    },
    [searchKind],
  );

  const debounce = useCallback(
    (query: string) => {
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
        setSuggestions({ status: "initial" });
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

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    query,
    selectOption,
    selectAddressOption,
    onInputChange,
  };
};
