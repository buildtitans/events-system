import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/lib/store";
import {
  EventSchemaType,
  NewEventInputSchemaType,
} from "@/src/schemas/events/eventSchema";
import { trpcClient } from "@/src/trpc/trpcClient";
import {
  enqueueAlert,
  enqueueDrawer,
  enqueueSnackbar,
} from "@/src/lib/store/slices/rendering/RenderingSlice";
import { Dayjs } from "dayjs";
import type { CreateEventHook } from "@/src/lib/types/hooks/types";
import { createNewEventNotification } from "../../utils/helpers/notifications/createScheduleNotification";
import { appendNewNotification } from "../../store/slices/notifications/notificationSlice";
import { getGroupEvents } from "../../store/slices/groups/OpenedGroupSlice";
import { useSearchAddressSuggestions } from "../search/useSearchLocationSuggestions";

export type NewEventType = {
  title: EventSchemaType["title"];
  description: EventSchemaType["description"];
  starts_at: string;
  group_id: EventSchemaType["group_id"];
  img: EventSchemaType["img"] | null;
  meeting_location: EventSchemaType["meeting_location"];
  tag: EventSchemaType["tag"];
};

function getPicDate() {
  return Date.now();
}

export const useCreateEvent = (
  group_id: EventSchemaType["group_id"],
): CreateEventHook => {
  const dispatch = useDispatch<AppDispatch>();
  const snackbar = useSelector((s: RootState) => s.rendering.snackbar);
  const groups = useSelector((s: RootState) => s.groups.communities);
  const picDate = getPicDate();
  const [createNotification, setCreateNotification] = useState<boolean>();
  const [newEvent, setNewEvent] = useState<NewEventType>({
    title: "",
    description: "",
    starts_at: "",
    group_id: group_id,
    img: `https://picsum.photos/800/450?random=${picDate}`,
    meeting_location: "",
    tag: "",
  });
  const isSubmittable = useMemo(() => {
    const filledOutForm =
      !!newEvent.title && !!newEvent.starts_at && !!newEvent.group_id;
    return !filledOutForm;
  }, [newEvent]);
  const currentGroup = useMemo(() => {
    const thisGroup = groups.find((grp) => grp.id === group_id);
    return thisGroup;
  }, [group_id, groups]);

  const handleTitle = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const val = e.target.value;

    setNewEvent((prev: NewEventType) => ({
      ...prev,
      title: val,
    }));
  };

  const handleLocation = (input: string) => {
    setNewEvent((prev: NewEventType) => ({
      ...prev,
      meeting_location: input,
    }));
  };

  const handleDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const val = e.target.value;
    setNewEvent((prev: NewEventType) => ({
      ...prev,
      description: val,
    }));
  };

  const handleStartsAt = (value: Dayjs | null) => {
    const date = value?.toISOString();
    setNewEvent((prev: NewEventType) => ({
      ...prev,
      starts_at: date ?? "",
    }));
  };

  const handleScheduleResult = async (result: EventSchemaType | null) => {
    if (result) dispatch(getGroupEvents({ status: "refreshing" }));

    dispatch(enqueueSnackbar({ kind: null, status: "idle" }));
    dispatch(
      enqueueAlert({
        kind: result ? "success" : "error",
        action: "createEvent",
      }),
    );
    setCreateNotification(true);
  };

  const scheduleEvent = async (newEvent: NewEventType) => {
    return await trpcClient.events.newEvent.mutate(newEvent);
  };

  const schedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(enqueueSnackbar({ kind: "newEvent", status: "pending" }));
    const result = await scheduleEvent(newEvent);
    await handleScheduleResult(result);
  };

  useEffect(() => {
    if (!currentGroup || !createNotification) return;

    const executeNotifyMembers = async () => {
      const scheduledEvent = newEvent as NewEventInputSchemaType;
      const notification = createNewEventNotification(
        scheduledEvent,
        currentGroup,
      );

      const result =
        await trpcClient.notifications.createNotification.mutate(notification);

      dispatch(
        appendNewNotification({
          status: "ready",
          data: {
            new: [result.items[0]],
            seen: [],
          },
        }),
      );

      setCreateNotification(false);
      dispatch(enqueueDrawer(null));
    };

    void executeNotifyMembers();
  }, [currentGroup, newEvent, snackbar, createNotification, dispatch]);

  return {
    schedule,
    handleTitle,
    handleDescription,
    handleStartsAt,
    handleLocation,
    isSubmittable,
  };
};
