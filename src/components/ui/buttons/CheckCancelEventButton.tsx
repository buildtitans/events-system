"use client";

import FormControlLabel from '@mui/material/FormControlLabel';
import type { UpdateEventArgsSchemaType } from '@/src/schemas/events/eventSchema';
import {
  openedEventCheckboxLabelSx,
} from '@/src/styles/sx/openedEventDrawer';
import { Button } from '@mui/material';
import React from 'react';

type CheckCancelEventButtonProps = {
    handleCancelClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
    newStatus: UpdateEventArgsSchemaType["status"],
    currentStatus: UpdateEventArgsSchemaType["status"]
}

export const CheckCancelEventButton = ({ handleCancelClick, newStatus, currentStatus }: CheckCancelEventButtonProps) => {
    

    return (
        <FormControlLabel
            sx={openedEventCheckboxLabelSx}
            control={
                <Button
                    onClick={(e) => handleCancelClick(e)}
                    sx={{
                height: 40,
                borderRadius: 999,
                border: "1px solid",
                borderColor: "rgba(124, 198, 255, 0.45)",
                background: "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.92) 100%)",
                color: "#07111d",
                fontWeight: 700,
                transition: "all 180ms ease",
                boxShadow: "0 14px 32px rgba(92, 167, 255, 0.24)",
                '&:hover': {
                    background: "linear-gradient(135deg, rgba(126, 204, 255, 0.98) 0%, rgba(96, 162, 255, 0.92) 100%)",
                    transform: "translateY(-1px)",
                },
                '&.Mui-focusVisible': {
                    outline: "2px solid rgba(124, 198, 255, 0.45)",
                    outlineOffset: "2px",
                },
                '&.Mui-disabled': {
                    opacity: 0.72,
                    color: "#07111d",
                },
            }}
                variant="contained"
                >
                    {currentStatus === "cancelled" ? "Rescind Cancellation" : "Cancel Event"}
                </Button>
            }
            label={""}
        />
    );
};
