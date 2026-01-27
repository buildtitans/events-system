"use client"
import type { } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers';
import type { JSX } from 'react';
import { CreateEventHook } from '@/src/lib/hooks/insert/useCreateEvent';
import { Dayjs } from 'dayjs';

export default function StartTime({ handleStartsAt }: { handleStartsAt: CreateEventHook["handleStartsAt"] }): JSX.Element {


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                closeOnSelect={true}
                onChange={(value, context) => handleStartsAt(value, context)}
                sx={{
                    backgroundColor: 'rgb(255, 255, 255, 0.2)',
                    border: 1,
                    borderColor: 'white',
                    borderRadius: 2
                }}
            />
        </LocalizationProvider>
    )
}