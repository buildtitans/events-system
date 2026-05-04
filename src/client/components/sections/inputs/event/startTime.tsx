"use client"
import type { } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers';
import type { JSX } from 'react';
import type { CreateEventHook } from '@/src/lib/types/hooks/types';
import { createEventTextFieldSx } from '@/src/client/styles/sx/createEventDrawer';

export default function StartTime({ handleStartsAt }: { handleStartsAt: CreateEventHook["handleStartsAt"] }): JSX.Element {


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label="Starts at"
                onChange={(value, context) => handleStartsAt(value, context)}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        sx: createEventTextFieldSx,
                    },
                }}
            />
        </LocalizationProvider>
    )
}
