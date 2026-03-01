"use client";
import { useState, useCallback, useRef } from "react";
import { trpcClient } from "@/src/trpc/trpcClient";
import type { AutocompleteInputChangeReason } from "@mui/material/useAutocomplete";
import {
  EventsArraySchemaType,
  EventSchemaType,
} from "@/src/schemas/events/eventSchema";

const WAIT_DURATION = 400;

type SuggestionType = {
  title: EventSchemaType["title"];
  event_id: EventSchemaType["id"];
};

type SuggestionOptions = Array<SuggestionType>;

type AutoCompleteOptions =
  | { status: "initial"; data: SuggestionOptions }
  | { status: "pending"; data: SuggestionOptions }
  | { status: "ready"; data: SuggestionOptions }
  | { status: "n/a"; data: SuggestionOptions; message: "Matched 0 terms" }
  | {
      status: "warnign";
      data: SuggestionOptions;
      error: "oops. something went wrong";
    };

export const useDebouncedSerach = () => {
  const timerRef = useRef<number | null>(null);

  const [input, setInput] = useState<string>("");

  const [suggestions, setSuggestions] = useState<AutoCompleteOptions>({
    status: "initial",
    data: [],
  });

  const sendRequest = useCallback(async (query: string) => {
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
      const request = await trpcClient.events.search.mutate(query);
      const lookup = mapSuggestions(request);

      if (lookup.length > 0) {
        setSuggestions({ status: "ready", data: lookup });
      } else {
        setSuggestions(() => ({
          status: "n/a",
          data: [],
          message: "Matched 0 terms",
        }));
      }
    } catch {
      setSuggestions((prev: AutoCompleteOptions) => ({
        ...prev,
        status: "warnign",
        error: "oops. something went wrong",
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

  function mapSuggestions(events: EventsArraySchemaType): SuggestionOptions {
    const arr: SuggestionOptions = [];

    for (const event of events) {
      arr.push({
        title: event.title,
        event_id: event.id,
      });
    }

    return arr;
  }

  return {
    input,
    onInputChange,
    suggestions: suggestions.data,
    status: suggestions.status,
    message: suggestions.status === "n/a" ? suggestions.message : undefined,
    error: suggestions.status === "warnign" ? suggestions.error : undefined,
  };
};
