"use client";
import { useCancelEvent } from "@/src/lib/hooks/update/events/useCancelEvent";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import Button from "@mui/material/Button";
import { CheckCancelEventButton } from "@/src/client/components/ui/buttons/CheckCancelEventButton";
import { JSX, useState } from "react";
import Container from "@mui/material/Container";
import ConfirmCancelEventPopover from "@/src/client/components/ui/modals/confirmCancelEventPopover";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import CancelIcon from "@mui/icons-material/Cancel";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
  getOpenedEventActionButtonSx,
  openedEventControlsDescriptionSx,
  openedEventControlsFormSx,
  openedEventControlsSectionSx,
  openedEventControlsTitleSx,
  openedEventSectionLabelSx,
} from "@/src/client/styles/sx/openedEventDrawer";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";

type RescheduleEventFormProps = {
  event: EventSchemaType;
};

export default function RescheduleEventForm({
  event,
}: RescheduleEventFormProps): JSX.Element | null {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { handleStatusChange, handleSubmit, options } = useCancelEvent(event);
  const isCurrent = isFutureOrNow(new Date(event.starts_at));

  if (!isCurrent) return null;

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleStatusChange();
    setAnchorEl(e.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  return (
    <Container
      sx={{
        ...openedEventControlsSectionSx,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
      disableGutters
    >
      <Stack component="form" sx={openedEventControlsFormSx}>
        <Typography component="span" sx={openedEventSectionLabelSx}>
          Organizer
        </Typography>
        <Typography component="h3" sx={openedEventControlsTitleSx}>
          Event Status
        </Typography>
        <Typography component="p" sx={openedEventControlsDescriptionSx}>
          Cancel or restore this event when the schedule changes.
        </Typography>
        <CheckCancelEventButton
          handleCancelClick={handleCancelClick}
          newStatus={options.status}
          currentStatus={event.status}
        />

        <ConfirmCancelEventPopover
          anchorEl={anchorEl}
          handleSubmit={handleSubmit}
          onClose={closePopover}
          currentStatus={event.status}
          handleStatusChange={handleStatusChange}
        />
        {event.status !== options.status && (
          <Button
            type="button"
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={getOpenedEventActionButtonSx(event.status === "scheduled")}
            startIcon={
              event.status === "scheduled" ? (
                <CancelIcon />
              ) : (
                <SettingsBackupRestoreIcon />
              )
            }
          >
            {event.status === "scheduled"
              ? "Confirm Cancellation"
              : "Confirm Rescind Cancellation"}
          </Button>
        )}
      </Stack>
    </Container>
  );
}
