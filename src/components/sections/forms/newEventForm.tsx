"use client"
import type { JSX } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import StartTime from "../inputs/event/startTime";
import { useCreateEvent } from "@/src/lib/hooks/insert/useCreateEvent";
import { useForm, Controller } from 'react-hook-form';
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import type { NewEventType } from "@/src/lib/hooks/insert/useCreateEvent";
import LocationInput from "../inputs/event/locationInput";
import {
    createEventDrawerFormSx,
    createEventFieldControlSx,
    createEventPrimaryButtonSx,
    createEventTextFieldSx,
} from "@/src/styles/sx/createEventDrawer";

export default function NewEventForm({ group_id }: { group_id: string }): JSX.Element {
    const { control } = useForm<NewEventType>()
    const {
        handleDescription,
        handleStartsAt,
        schedule,
        handleTitle,
        handleLocation,
        isSubmittable,
    } = useCreateEvent(group_id);


    return (
        <Box
            component="form"
            sx={createEventDrawerFormSx}
            onSubmit={(e) => schedule(e)}
        >
                <Controller

                    name="title"
                    control={control}
                    render={() => (
                            <FormControl fullWidth sx={createEventFieldControlSx}>
                                <TextField
                                    onChange={(e) => handleTitle(e)}
                                    label="Title"
                                    fullWidth
                                    autoFocus
                                    sx={createEventTextFieldSx}
                                />
                            </FormControl>

                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    render={() => (
                        <FormControl fullWidth sx={createEventFieldControlSx}>
                            <TextField
                                onChange={(e) => handleDescription(e)}
                                label="Description"
                                fullWidth
                                sx={createEventTextFieldSx}
                            />
                        </FormControl>

                    )}
                />

                <LocationInput 
                control={control}  
                handleLocation={handleLocation}
                />
                
                <Controller
                    name="starts_at"
                    control={control}
                    render={() => (
                        <FormControl fullWidth sx={createEventFieldControlSx}>
                            <StartTime
                                handleStartsAt={handleStartsAt}
                            />
                        </FormControl>
                    )}
                />
                <FormControl>
                    <Button
                        disabled={isSubmittable}
                        variant="contained"
                        type="submit"
                        startIcon={<AddIcon />}
                        sx={createEventPrimaryButtonSx}
                    >
                        Schedule Event
                    </Button>
                </FormControl>
        </Box>
    )
}


