"use client";
import { useState, useCallback, useRef } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import type {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/useAutocomplete";
import type { AutoCompleteSearch, SuggestionType } from "./types";
import type { AppSearchSearchHook } from "../../types/hooks/types";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { enqueueSidebar } from "../../store/slices/rendering/RenderingSlice";
import { useSelectEvent } from "../hydration/event/useSelectEvent";
import { AppSearchService } from "../../store/services/search/appSearchService";
import { logCaughtError } from "../../utils/errors/logCaughtError";
import { assertNever } from "../../utils/assert/assertNever";
import { useDebouncedCallback } from "./useDebounce";
const service = new AppSearchService(trpcClient);

export const useAppSearch = (): AppSearchSearchHook => {
  const dispatch = useDispatch<AppDispatch>();
  const storedGroups = useSelector((s: RootState) => s.groups.communities);
  const router = useRouter();
  const requestIdRef = useRef<number>(0);
  const [input, setInput] = useState<string>("");
  const [suggestions, setSuggestions] = useState<AutoCompleteSearch>({
    status: "initial",
  });
  const { handleOpenEvent } = useSelectEvent();

  const sendRequest = useCallback(
    async (query: string) => {
      const requestId = ++requestIdRef.current;
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        setSuggestions({ status: "initial" });
        return;
      }
      setSuggestions({ status: "pending" });

      try {
        const results = await service.search(trimmedQuery, storedGroups);

        if (requestId !== requestIdRef.current) return;

        setSuggestions({ status: "ready", data: results });
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        logCaughtError("useDebouncedSearch.sendRequest()", err);
        setSuggestions({
          status: "failed",
          error: `Unexpected error searching query ${trimmedQuery}`,
        });
      }
    },
    [storedGroups],
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
      _event: React.SyntheticEvent,
      value: string,
      reason: AutocompleteInputChangeReason,
    ) => {
      if (reason === "input") {
        setInput(value);
        requestIdRef.current++;
        debounce(value);
      }

      if (reason === "clear") {
        setInput("");
        resetSearch();
      }
    },
    [debounce, resetSearch],
  );

  const selectOption = useCallback(
    (
      _event: React.SyntheticEvent,
      value: SuggestionType | null,
      reason: AutocompleteChangeReason,
    ) => {
      if (reason !== "selectOption" || value === null) return;

      resetSearch();

      switch (value.kind) {
        case "event": {
          handleOpenEvent(value.event_id);
          return;
        }
        case "group": {
          setInput(value.label);
          const redirectRoute = `/group/${value.slug}`;
          router.push(redirectRoute);
          dispatch(enqueueSidebar("group"));
          return;
        }

        default: {
          return assertNever(value);
        }
      }
    },
    [router, dispatch, handleOpenEvent, resetSearch],
  );

  return {
    input,
    onInputChange,
    selectOption,
    suggestions,
  };
};
