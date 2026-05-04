"use client";
import type { ButtonActions, EventDrawerFormState } from "../contents/memberAndOrganizerActions";
import type { Dispatch, SetStateAction } from "react";
import { Stack, Typography, Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import {
  getOpenedEventActionOptionSx,
  openedEventActionRailSx,
  openedEventActionsLabelSx,
  openedEventActionsSectionSx,
} from "@/src/client/styles/sx/openedEventDrawer";

type ActionButtonsProps = {
  setOpenAction: Dispatch<SetStateAction<EventDrawerFormState>>;
  actions: ButtonActions;
  currentAction: EventDrawerFormState;
};

function getActionIcon(kind: EventDrawerFormState) {
  switch (kind) {
    case "details":
      return <InfoOutlinedIcon fontSize="small" />;
    case "attendance form":
      return <HowToRegOutlinedIcon fontSize="small" />;
    case "schedule change":
      return <EventBusyOutlinedIcon fontSize="small" />;
  }
}

export function ActionButtons({
  setOpenAction,
  actions,
  currentAction,
}: ActionButtonsProps) {
  return (
    <Stack sx={openedEventActionsSectionSx}>
      <Stack direction={"row"} justifyContent={"start"}>
        <Typography sx={openedEventActionsLabelSx}>
          Display Options
        </Typography>
      </Stack>

      <Stack sx={openedEventActionRailSx}>
        {actions.map((action) => (
          <Button
            key={action.kind}
            variant="outlined"
            onClick={() => setOpenAction(action.kind)}
            startIcon={getActionIcon(action.kind)}
            sx={getOpenedEventActionOptionSx(currentAction === action.kind)}
          >
            {action.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
