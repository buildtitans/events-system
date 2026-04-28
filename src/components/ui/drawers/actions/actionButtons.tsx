"use client";
import type { ButtonActions, EventDrawerFormState } from "../contents/memberAndOrganizerActions";
import type { SetStateAction } from "react";
import { Stack, Typography, Button } from "@mui/material";

type ActionButtonsProps = {
  setOpenAction: React.Dispatch<SetStateAction<EventDrawerFormState>>;
  actions: ButtonActions;
};

export function ActionButtons({ setOpenAction, actions }: ActionButtonsProps) {
  return (
    <Stack direction={"column"} gap={2}>
      <Stack direction={"row"} justifyContent={"center"}>
        <Typography variant="caption" color="textDisabled" textAlign={"center"}>
          Display Options
        </Typography>
      </Stack>

      <Stack direction={"row"} justifyContent={"space-between"}>
        {actions.map((action) => (
          <Button
            variant="contained"
            onClick={() => setOpenAction(action.kind)}
          >
            {action.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}