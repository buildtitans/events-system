"use client";
import type {
  ButtonActions,
  EventDrawerFormState,
} from "../contents/memberAndOrganizerActions";
import type { Dispatch, SetStateAction } from "react";
import { Stack, Typography, Button } from "@mui/material";
import { getActionIcon } from "@/src/lib/utils/helpers/rendering/getActionIcon";
import {
  getOpenedEventActionOptionSx,
  openedEventActionRailSx,
  openedEventActionsLabelSx,
  openedEventActionsSectionSx,
} from "@/src/client/styles/sx/openedEventDrawer";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { filterActions } from "@/src/lib/utils/helpers/rendering/filterActions";

type ActionButtonsProps = {
  setOpenAction: Dispatch<SetStateAction<EventDrawerFormState>>;
  actions: ButtonActions;
  currentAction: EventDrawerFormState;
  eventStatus: EventSchemaType["status"];
};

export function ActionButtons({
  setOpenAction,
  actions,
  currentAction,
  eventStatus,
}: ActionButtonsProps) {
  const availableActions = filterActions(eventStatus, actions);

  return (
    <Stack sx={openedEventActionsSectionSx}>
      <Stack direction={"row"} justifyContent={"start"}>
        <Typography sx={openedEventActionsLabelSx}>Display Options</Typography>
      </Stack>

      <Stack sx={openedEventActionRailSx}>
        {availableActions.map((action) => (
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
