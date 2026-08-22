"use client";
import type { JSX } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import StartTime from "@/src/client/components/sections/inputs/event/startTime";
import { useCreateEvent } from "@/src/lib/hooks/insert/useCreateEvent";
import { useForm, Controller } from "react-hook-form";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import type { NewEventInput } from "@/src/lib/types/hooks/types";
import EventLocationInput from "@/src/client/components/sections/inputs/event/eventLocationInput";
import {
  createEventDrawerFormSx,
  createEventFieldControlSx,
  createEventPrimaryButtonSx,
  createEventTextFieldSx,
} from "@/src/client/styles/sx/createEventDrawer";
import EventTagInput from "../../inputs/event/eventTagInput";

export default function NewEventForm({
  group_id,
}: {
  group_id: string;
}): JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<NewEventInput>({
    mode: "onChange",
    defaultValues: {
      tag: "",
    },
  });
  const {
    handleStartsAt,
    schedule,
    handleLocation,
    getInput,
    getEventTagError,
    isDisabled,
  } = useCreateEvent(group_id);

  return (
    <Box
      component="form"
      sx={createEventDrawerFormSx}
      onSubmit={handleSubmit(() => schedule())}
    >
      <Controller
        name="title"
        control={control}
        render={() => (
          <FormControl fullWidth sx={createEventFieldControlSx}>
            <TextField
              onChange={(e) => getInput(e, "title")}
              label="Title"
              fullWidth
              autoFocus
              sx={createEventTextFieldSx}
            />
          </FormControl>
        )}
      />
      <Controller
        name="description"
        control={control}
        render={() => (
          <FormControl fullWidth sx={createEventFieldControlSx}>
            <TextField
              onChange={(e) => getInput(e, "description")}
              label="Description"
              fullWidth
              sx={createEventTextFieldSx}
            />
          </FormControl>
        )}
      />

      <EventTagInput
        control={control}
        getEventTagError={getEventTagError}
        getInput={getInput}
      />

      <EventLocationInput
        control={control}
        handleLocation={handleLocation}
        searchKind={"street"}
      />

      <Controller
        name="starts_at"
        control={control}
        render={() => (
          <FormControl fullWidth sx={createEventFieldControlSx}>
            <StartTime handleStartsAt={handleStartsAt} />
          </FormControl>
        )}
      />
      <FormControl>
        <Button
          disabled={isDisabled || !isValid}
          variant="contained"
          type="submit"
          startIcon={<AddIcon />}
          sx={createEventPrimaryButtonSx}
        >
          Schedule Event
        </Button>
      </FormControl>
    </Box>
  );
}
