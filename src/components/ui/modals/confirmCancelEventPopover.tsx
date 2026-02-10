"use client";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { JSX } from "react";
import { CancelEventHook } from "@/src/lib/types/hooks/types";

type ConfirmCancelEventPopoverProps = {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    handleSubmit: CancelEventHook["handleSubmit"];
    currentStatus: CancelEventHook["options"]["status"]
};

export default function ConfirmCancelEventPopover({
    anchorEl,
    onClose,
    handleSubmit,
    currentStatus
}: ConfirmCancelEventPopoverProps): JSX.Element {

    const open = Boolean(anchorEl);

    const executeSubmmitAndClosePopover = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onClose();
        handleSubmit(e)
    }

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
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
                    width: 320,
                    p: 3,
                    gap: 3
                }}
            >
                <Typography
                    component="h2"
                    sx={{
                        fontSize: 20,
                        fontWeight: 400,
                        textAlign: "center"
                    }}
                >
                    {(currentStatus === "scheduled") ? "Cancel this event?" : "Rescind cancellation?"}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>


                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                    >
                        Nevermind
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color={(currentStatus === "scheduled") ? "error" : "primary"}
                        onClick={(e) => executeSubmmitAndClosePopover(e)}
                    >
                        {(currentStatus === "scheduled") ? "Yes, Cancel" : "Yes"}
                    </Button>
                </Box>
            </Stack>
        </Popover>
    );
}
