"use client"
import type { JSX } from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import StartTime from "../inputs/event/startTime";
import { useCreateEvent } from "@/src/lib/hooks/insert/useCreateEvent";
import { useForm, Controller } from 'react-hook-form';
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import type { NewEventType } from "@/src/lib/hooks/insert/useCreateEvent";

export default function NewEventForm({ group_id }: { group_id: string }): JSX.Element {
    const { control } = useForm<NewEventType>()
    const {
        handleDescription,
        handleStartsAt,
        schedule,
        handleTitle,
        handleLocation,
        isSubmittable
    } = useCreateEvent(group_id);


    return (
        <Stack
            sx={{
                width: 'auto',
                height: '100%',
                paddingY: '100px',
                marginX: 'auto',
            }}
        >
            <form
                style={{
                    width: '450px',
                    height: '100%',
                    gap: 40,
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onSubmit={(e) => schedule(e)}
            >
                <Controller

                    name="title"
                    control={control}
                    render={() => (
                        <>
                            <Typography component={"h1"} sx={{
                                fontSize: '26px',
                                borderBottom: 1,
                                borderColor: 'rgb(255, 255, 255, 0.15)'
                            }}>
                                New Event
                            </Typography>
                            <FormControl sx={{
                            }}>
                                <TextField
                                    onChange={(e) => handleTitle(e)}
                                    label="Title"
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderRadius: 2,
                                        },

                                        "& .MuiFormLabel-root.Mui-focused": {
                                            border: 0
                                        },
                                    }}

                                />
                            </FormControl>
                        </>

                    )}
                />
                <Controller
                    name="description"
                    control={control}
                    render={() => (
                        <FormControl sx={{
                        }}>
                            <TextField
                                onChange={(e) => handleDescription(e)}
                                label="Description"
                                sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: 2,
                                    },

                                    "& .MuiFormLabel-root.Mui-focused": {
                                        border: 0
                                    },
                                }}
                            />
                        </FormControl>

                    )}
                />

                <Controller
                    name="meeting_location"
                    control={control}
                    render={() => (

                        <FormControl>

                            <TextField
                                onChange={(e) => handleLocation(e)}
                                label="Location"
                                sx={{
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderRadius: 2,
                                    },

                                    "& .MuiFormLabel-root.Mui-focused": {
                                        border: 0
                                    },
                                }}
                            />
                        </FormControl>
                    )}
                />

                <Controller
                    name="starts_at"
                    control={control}
                    render={() => (
                        <FormControl>
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
                    >
                        Schedule Event
                    </Button>
                </FormControl>



            </form>


        </Stack>
    )
}


