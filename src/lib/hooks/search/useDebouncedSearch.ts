"use client";
import { useState, useCallback, useRef } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import type {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/useAutocomplete";
import type { AutoCompleteOptions, SuggestionType } from "./types";
import { compileSearchOptions } from "../../utils/helpers/search/compileSearchLookup";
import type { DebouncedSearchHook } from "../../types/hooks/types";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { enqueueSidebar } from "../../store/slices/rendering/RenderingSlice";
const WAIT_DURATION = 400;

export const useDebouncedSerach = (): DebouncedSearchHook => {
  const dispatch = useDispatch<AppDispatch>();
  const storedGroups = useSelector((s: RootState) => s.groups.communities);
  const router = useRouter();
  const timerRef = useRef<number | null>(null);
  const requestIdRef = useRef<number>(0);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<AutoCompleteOptions>({
    status: "initial",
    data: [],
    message: null,
    error: null,
  });

  const sendRequest = useCallback(
    async (query: string) => {
      const requestId = ++requestIdRef.current;

      if (!query.trim()) {
        setSuggestions((prev: AutoCompleteOptions) => ({
          ...prev,
          status: "initial",
          data: [],
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

        if (requestId !== requestIdRef.current) return;

        const lookup = compileSearchOptions(events, groups, storedGroups);

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
    },
    [storedGroups],
  );

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
      if (reason === "input") {
        setInput(value);
        debounce(value);
      }

      if (reason === "clear") {
        setInput("");
        requestIdRef.current++;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setSuggestions((prev: AutoCompleteOptions) => ({
          ...prev,
          status: "initial",
          data: [],
        }));
      }
    },
    [debounce],
  );

  const selectOption = useCallback(
    (
      _event: React.SyntheticEvent,
      value: SuggestionType | null,
      reason: AutocompleteChangeReason,
    ) => {
      if (reason === "selectOption" && value?.slug) {
        setInput(value.label);
        setSuggestions(() => ({
          status: "initial",
          data: [],
          message: null,
          error: null,
        }));

        const redirectRoute = `/group/${value.slug}`;
        router.push(redirectRoute);
        dispatch(enqueueSidebar("group"));
      }
    },
    [router, dispatch],
  );

  return {
    input,
    onInputChange,
    selectOption,
    suggestions: suggestions.data,
    status: suggestions.status,
    message: suggestions.message,
    error: suggestions.error,
  };
};
