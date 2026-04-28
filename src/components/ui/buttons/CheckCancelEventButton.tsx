"use client";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { UpdateEventArgsSchemaType } from '@/src/schemas/events/eventSchema';
import { CancelEventHook } from '@/src/lib/types/hooks/types';
import {
  getOpenedEventCheckboxSx,
  openedEventCheckboxLabelSx,
} from '@/src/styles/sx/openedEventDrawer';

type CheckCancelEventButtonProps = {
    handleStatusChange: CancelEventHook["handleStatusChange"],
    newStatus: UpdateEventArgsSchemaType["status"],
    currentStatus: UpdateEventArgsSchemaType["status"]
}

export const CheckCancelEventButton = ({ handleStatusChange, newStatus, currentStatus }: CheckCancelEventButtonProps) => {
    const isDanger = currentStatus === "scheduled";

    return (
        <FormControlLabel
            sx={openedEventCheckboxLabelSx}
            control={
                <Checkbox
                    checked={(newStatus !== currentStatus)}
                    onChange={handleStatusChange}
                    sx={getOpenedEventCheckboxSx(isDanger)}

                />
            }
            label={(currentStatus === "scheduled") ? "Cancel Event" : "Rescind Cancellation"}
        />
    );
};
