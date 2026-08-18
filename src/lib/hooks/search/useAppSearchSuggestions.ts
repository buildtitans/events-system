"use client";
import { useState, useCallback } from "react";
import type {
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
} from "@mui/material/useAutocomplete";
import type { SuggestionType } from "./types";
import type { AppSearchSuggestionsHook } from "../../types/hooks/types";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { enqueueSidebar } from "../../store/slices/rendering/RenderingSlice";
import { useSelectEvent } from "../hydration/event/useSelectEvent";
import { assertNever } from "../../utils/assert/assertNever";
import { useDebouncedCallback } from "./useDebounce";
import { getSuggestedItems } from "../../store/slices/search/appSearchSlice";
import { querySuggestions } from "../../store/slices/search/thunks";

export const useAppSearchSuggestions = (): AppSearchSuggestionsHook => {
  const dispatch = useDispatch<AppDispatch>();
  const storedGroups = useSelector((s: RootState) => s.groups.communities);
  const router = useRouter();
  const [input, setInput] = useState<string>("");

  const { handleOpenEvent } = useSelectEvent();

  const getSuggestions = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery) {
        dispatch(getSuggestedItems({ status: "initial" }));
        return;
      }

      void dispatch(querySuggestions({ query: trimmedQuery, storedGroups }));
    },
    [storedGroups, dispatch],
  );

  const { run: debounce, cancel: cancelDebounce } =
    useDebouncedCallback(getSuggestions);

  const resetSuggestions = useCallback((): void => {
    cancelDebounce();
    dispatch(getSuggestedItems({ status: "initial" }));
  }, [cancelDebounce, dispatch]);

  const onInputChange = useCallback(
    (
      _event: React.SyntheticEvent,
      value: string,
      reason: AutocompleteInputChangeReason,
    ) => {
      if (reason === "input") {
        setInput(value);
        dispatch(getSuggestedItems({ status: "initial" }));
        debounce(value);
      }

      if (reason === "clear") {
        setInput("");
        resetSuggestions();
      }
    },
    [debounce, resetSuggestions, dispatch],
  );

  const selectOption = useCallback(
    (
      _event: React.SyntheticEvent,
      value: SuggestionType | null,
      reason: AutocompleteChangeReason,
    ) => {
      if (reason !== "selectOption" || value === null) return;

      resetSuggestions();

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
    [router, dispatch, handleOpenEvent, resetSuggestions],
  );

  return {
    input,
    onInputChange,
    selectOption,
    resetSuggestions,
  };
};
