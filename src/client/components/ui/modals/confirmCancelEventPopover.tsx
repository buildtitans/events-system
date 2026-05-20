"use client";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { JSX } from "react";
import { CancelEventHook } from "@/src/lib/types/hooks/types";
import {
  getOpenedEventActionButtonSx,
  openedEventPopoverActionsSx,
  openedEventPopoverPaperSx,
  openedEventPopoverTitleSx,
} from "@/src/client/styles/sx/openedEventDrawer";

type ConfirmCancelEventPopoverProps = {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    handleSubmit: CancelEventHook["handleSubmit"];
    currentStatus: CancelEventHook["options"]["status"];
        handleStatusChange: CancelEventHook["handleStatusChange"],
};

export default function ConfirmCancelEventPopover({
    anchorEl,
    onClose,
    handleSubmit,
    currentStatus,
    handleStatusChange
}: ConfirmCancelEventPopoverProps): JSX.Element {

    const open = Boolean(anchorEl);

    const executeSubmmitAndClosePopover = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onClose();
        handleSubmit(e)
    }

    const handleNevermind = () => {

        handleStatusChange();
        onClose()
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: openedEventPopoverPaperSx
                }
            }}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
        >
            <Stack
                sx={{
                    gap: 3
                }}
            >
                <Typography
                    component="h2"
                    sx={openedEventPopoverTitleSx}
                >
                    {(currentStatus === "scheduled") ? "Cancel this event?" : "Rescind cancellation?"}
                </Typography>

                <Box sx={openedEventPopoverActionsSx}>


                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleNevermind}
                        sx={getOpenedEventActionButtonSx(false)}
                    >
                        Nevermind
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color={(currentStatus === "scheduled") ? "error" : "primary"}
                        onClick={(e) => executeSubmmitAndClosePopover(e)}
                        sx={getOpenedEventActionButtonSx(currentStatus === "scheduled")}
                    >
                        {(currentStatus === "scheduled") ? "Yes, Cancel" : "Yes"}
                    </Button>
                </Box>
            </Stack>
        </Popover>
    );
}
