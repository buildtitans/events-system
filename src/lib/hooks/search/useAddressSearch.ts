import type { SyntheticEvent } from "react";
import { useCallback, useRef, useState } from "react";
import type {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/useAutocomplete";

import type {
  AddressSuggestion,
  AddressSearchState,
  SearchAddressSuggestionsHook,
} from "@/src/lib/hooks/search/types";
import type { CreateEventHook } from "@/src/lib/types/hooks/types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { searchByAddressKind } from "@/src/lib/utils/helpers/search/searchByAddressKind";
import { useDebouncedCallback } from "./useDebounce";

export const useAddressSearch = (
  handleLocation: CreateEventHook["handleLocation"],
  searchKind: "city" | "street" = "street",
): SearchAddressSuggestionsHook => {
  const requestIdRef = useRef<number>(0);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<AddressSearchState>({
    status: "initial",
  });

  const sendRequest = useCallback(
    async (value: string): Promise<void> => {
      const requestId = ++requestIdRef.current;
      const trimmedQuery = value.trim();

      if (!trimmedQuery) {
        setSuggestions({ status: "initial" });
        return;
      }

      setSuggestions({ status: "pending" });

      try {
        const results = await searchByAddressKind(searchKind, trimmedQuery);

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

        logCaughtError("useAddressSearch.sendRequest()", err);

        setSuggestions({
          status: "failed",
          error: err instanceof Error ? err.message : String(err),
        });
      }
    },
    [searchKind],
  );

  const { run: debounce, cancel: cancelDebounce } =
    useDebouncedCallback(sendRequest);

  const resetSearch = useCallback((): void => {
    requestIdRef.current++;
    cancelDebounce();
    setSuggestions({ status: "initial" });
  }, [cancelDebounce]);

  const onInputChange = useCallback(
    (
      _event: SyntheticEvent,
      value: string,
      reason: AutocompleteInputChangeReason,
    ): void => {
      if (reason === "input") {
        setQuery(value);

        requestIdRef.current++;
        debounce(value);
        return;
      }

      if (reason === "clear") {
        setQuery("");
        handleLocation("");
        resetSearch();
      }
    },
    [debounce, handleLocation, resetSearch],
  );

  const selectAddressOption = useCallback(
    (
      _event: SyntheticEvent,
      value: AddressSuggestion | null,
      reason: AutocompleteChangeReason,
    ): void => {
      if (reason !== "selectOption" || value === null) return;

      resetSearch();
      setQuery(value.label);
      handleLocation(value.label);
    },
    [handleLocation, resetSearch],
  );

  const selectOption = useCallback(
    (option: AddressSuggestion): void => {
      resetSearch();
      setQuery(option.label);
      handleLocation(option.label);
    },
    [handleLocation, resetSearch],
  );

  return {
    suggestions,
    query,
    selectOption,
    selectAddressOption,
    onInputChange,
  };
};
