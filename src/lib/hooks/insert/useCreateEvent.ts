"use client";
import type { CreateEventHook } from "@/src/lib/types/hooks/types";
import type { NewEventInput } from "@/src/lib/types/hooks/types";
import type { AppDispatch, RootState } from "@/src/lib/store";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Dayjs } from "dayjs";
import {
  type EventSchemaType,
  NewEventInputSchema,
} from "@/src/schemas/events/eventSchema";
import { createInitialNewEventState } from "@/src/lib/utils/newEvent/createInitialNewEventState";
import { scheduleNewEvent } from "@/src/lib/store/slices/groups/thunks";
import { useCreateNotifications } from "@/src/lib/hooks/update/notifications/useCreateNotifications";
import { assertSchema } from "@/src/lib/utils/assert/assertSchema";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { disableCreateEventButton } from "@/src/lib/utils/helpers/rendering/disableCreateEventButton";
import {
  EVENT_TAG_MAX_LENGTH,
  EVENT_TAG_MAX_WORDS,
} from "@/src/lib/tokens/eventTagTokens";

export const useCreateEvent = (
  group_id: EventSchemaType["group_id"],
): CreateEventHook => {
  const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
  const [newEvent, setNewEvent] = useState<NewEventInput>(() =>
    createInitialNewEventState(group_id),
  );
  const isDisabled = useMemo(() => {
    return disableCreateEventButton({ snackbar, newEvent });
  }, [newEvent, snackbar]);
  const { createEventScheduledNotifications } = useCreateNotifications();
  const dispatch = useDispatch<AppDispatch>();

  function getEventTagError(value: NewEventInput["tag"]): string | true {
    const normalized = value?.trim() ?? "";

    if (!normalized) return true;

    if (normalized.length > EVENT_TAG_MAX_LENGTH) {
      return `Tag must be ${EVENT_TAG_MAX_LENGTH} characters or fewer`;
    }

    const words = normalized.split(/\s+/);

    if (words.length > EVENT_TAG_MAX_WORDS) {
      return `Tag can contain no more than ${EVENT_TAG_MAX_WORDS} words`;
    }

    return true;
  }

  const getInput = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: keyof NewEventInput,
  ) => {
    const value = e.target.value;

    setNewEvent((prev: NewEventInput) => ({
      ...prev,
      [field]: value.trim(),
    }));
  };

  const handleLocation = (input: string) => {
    setNewEvent((prev: NewEventInput) => ({
      ...prev,
      meeting_location: input,
    }));
  };

  const handleStartsAt = (value: Dayjs | null) => {
    const date = value?.toISOString() ?? "";
    setNewEvent((prev: NewEventInput) => ({
      ...prev,
      starts_at: date,
    }));
  };

  const schedule = async () => {
    try {
      const input = {
        ...newEvent,
        tag: newEvent.tag?.trim() || null,
      } satisfies NewEventInput;

      const validatedEvent = assertSchema(input, NewEventInputSchema);

      const scheduledEvent = await dispatch(
        scheduleNewEvent(validatedEvent),
      ).unwrap();

      await createEventScheduledNotifications(scheduledEvent);
    } catch (err) {
      logCaughtError("useCreateEvent.schedule()", err);
    }
  };

  return {
    schedule,
    handleStartsAt,
    handleLocation,
    getInput,
    getEventTagError,
    isDisabled,
  };
};
