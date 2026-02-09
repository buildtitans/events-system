"use client"
import type { } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers';
import type { JSX } from 'react';
import type { CreateEventHook } from '@/src/lib/types/hooks/types';

export default function StartTime({ handleStartsAt }: { handleStartsAt: CreateEventHook["handleStartsAt"] }): JSX.Element {


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                label="Starts at"
                onChange={(value, context) => handleStartsAt(value, context)}

                slotProps={{
                    textField: {
                        sx: {
                            // 1. Style the box corners
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: '12px',
                                borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            // 2. Style the label root
                            "& .MuiInputLabel-root": {
                                color: 'rgba(255, 255, 255, 0.7)',
                            },
                            // 3. Optional: Style label background when it shrinks (floats)
                            "& .MuiInputLabel-shrink": {
                                backgroundColor: 'black',
                                padding: '0 4px',
                                borderRadius: '4px',
                            }
                        }
                    }
                }}
            />
        </LocalizationProvider>
    )
}