"use client"
import Drawer from "@mui/material/Drawer";
import type { JSX } from "react";
import Stack from "@mui/material/Stack";
import { enqueueDrawer } from "@/src/lib/store/slices/RenderingSlice";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { useCreateEvent } from "@/src/lib/hooks/insert/useCreateEvent";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { useMemo } from "react";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";


export default function CreateEventDrawer({ open }: { open: boolean }): JSX.Element {
    const dispatch = useDispatch<AppDispatch>();
    const tab = useSelector((s: RootState) => s.rendering.mainContent);
    const groups = useSelector((s: RootState) => s.groups.communities);
    const path = usePathname();
    const group_id = useMemo(() => {
        const slug = path.split('').slice(8).join('');

        const currentGroup = groups.find((group: GroupSchemaType) => group.slug === slug);
        return currentGroup?.id;
    }, [path, groups])

    const { handleDescription, handleStartsAt, handleSubmit, handleTitle } = useCreateEvent(group_id ?? "");

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={() => dispatch(enqueueDrawer(null))}
            transitionDuration={{ enter: 300, exit: 250 }}
            sx={{
                width: 'auto',
                height: '100%',
            }}

            PaperProps={{
                sx: {
                    width: 400,
                    bgcolor: "black",
                },
            }}
        >
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
        </Drawer>
    )
}