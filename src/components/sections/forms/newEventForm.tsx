"use client"
import type { JSX } from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import { useCreateEvent } from "@/src/lib/hooks/insert/useCreateEvent";

export default function NewEventForm({ group_id }: { group_id: string }): JSX.Element {

    const {
        handleDescription,
        handleStartsAt,
        handleSubmit,
        handleTitle
    } = useCreateEvent(group_id ?? "");

    //TODO: wire in the useCreateEvent hook with proper form input fields to create the event.
    //  alerts and snackbar components should be already wired up for the feedback in the UI


    return (
        <Stack
            sx={{
                width: '400px',
                height: '100%',
                paddingX: '20px',
                gap: 6,
                paddingY: '100px'

            }}
        >
            <Typography component={"h1"}>
                New Event
            </Typography>
            <FormControl sx={{
            }}>
                <FormLabel>
                    Event Name
                </FormLabel>
                <TextField
                    sx={{
                        backgroundColor: 'rgb(255, 255, 255, 0.2)',
                        border: 1,
                        borderColor: 'white',
                        borderRadius: 2
                    }}
                />
            </FormControl>
            <FormControl sx={{
            }}>
                <FormLabel>
                    Location
                </FormLabel>
                <TextField
                    sx={{
                        backgroundColor: 'rgb(255, 255, 255, 0.1)',
                        border: 1,
                        borderColor: 'white',
                        borderRadius: 2
                    }}
                />
            </FormControl>
            <FormControl sx={{
            }}>
                <FormLabel>
                    Starts at
                </FormLabel>
                <TextField
                    sx={{
                        backgroundColor: 'rgb(255, 255, 255, 0.1)',
                        border: 1,
                        borderColor: 'white',
                        borderRadius: 2
                    }}
                />
            </FormControl>
        </Stack>
    )
}