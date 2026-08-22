import {
  createEventFieldControlSx,
  createEventTextFieldSx,
} from "@/src/client/styles/sx/createEventDrawer";
import { EVENT_TAG_MAX_LENGTH } from "@/src/lib/tokens/eventTagTokens";
import type { NewEventInput } from "@/src/lib/types/hooks/types";
import { FormControl, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";

type EventTagInputProps = {
  control: Control<NewEventInput>;
  getEventTagError(value: NewEventInput["tag"]): string | true;
  getInput: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: keyof NewEventInput,
  ) => void;
};

export default function EventTagInput({
  control,
  getEventTagError,
  getInput,
}: EventTagInputProps) {
  return (
    <Controller
      name="tag"
      control={control}
      rules={{
        validate: getEventTagError,
      }}
      render={({ field, fieldState }) => (
        <FormControl fullWidth sx={createEventFieldControlSx}>
          <TextField
            {...field}
            value={field.value ?? ""}
            label="Tag"
            placeholder="e.g. Live Music"
            error={fieldState.invalid}
            helperText={
              fieldState.error?.message ??
              `${field.value?.length ?? 0}/${EVENT_TAG_MAX_LENGTH} · Maximum 2 words`
            }
            slotProps={{
              htmlInput: {
                maxLength: EVENT_TAG_MAX_LENGTH,
              },
            }}
            onChange={(event) => {
              field.onChange(event);
              getInput(event, "tag");
            }}
            fullWidth
            sx={createEventTextFieldSx}
          />
        </FormControl>
      )}
    />
  );
}
