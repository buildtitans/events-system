"use client";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { UpdateEventArgsSchemaType } from '@/src/schemas/events/eventSchema';
import { CancelEventHook } from '@/src/lib/types/hooks/types';

type CheckCancelEventButtonProps = {
    handleStatusChange: CancelEventHook["handleStatusChange"],
    newStatus: UpdateEventArgsSchemaType["status"],
    currentStatus: UpdateEventArgsSchemaType["status"]
}

export const CheckCancelEventButton = ({ handleStatusChange, newStatus, currentStatus }: CheckCancelEventButtonProps) => {

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={(newStatus !== currentStatus)}
                    onChange={handleStatusChange}

                />
            }
            label={(currentStatus === "scheduled") ? "Cancel Event" : "Rescind Cancellation"}
        />
    );
};
