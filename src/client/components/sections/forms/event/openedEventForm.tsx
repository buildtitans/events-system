"use client";
import { type JSX } from "react";
import Container from "@mui/material/Container";
import { useForm, Controller } from 'react-hook-form';
import { useUpdateAttendance } from "@/src/lib/hooks/update/useUpdateAttendance";
import { EventAttendantStatusSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ATTENDANCE_OPTIONS } from "@/src/lib/tokens/attentanceStatusTokens";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import Button from "@mui/material/Button";
import UpdateIcon from '@mui/icons-material/Update';
import FadeInOutBox from "../../../ui/box/motionboxes/fadeInOutBox";
import InputLabel from '@mui/material/InputLabel';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {
  openedEventControlsDescriptionSx,
  openedEventControlsFormSx,
  openedEventMenuPaperSx,
  openedEventPrimaryButtonSx,
  openedEventSectionLabelSx,
  openedEventSelectLabelSx,
  openedEventSelectSx,
} from "@/src/styles/sx/openedEventDrawer";

type UpdateViewerAttendanceFormProps = {
    currentStatus: EventAttendantStatusSchemaType,
    event_id: EventSchemaType["id"],
};

type UpdateAttendanceStatusForm = {
    status: EventAttendantStatusSchemaType | null,
}

export default function UpdateViewerAttendanceForm({
    currentStatus,
    event_id,
}: UpdateViewerAttendanceFormProps
): JSX.Element {
    const { control } = useForm<UpdateAttendanceStatusForm>();
    const {
        newStatus,
        handleStatusChange,
        handleSubmit
    } = useUpdateAttendance(currentStatus, event_id);

    return (
        <FadeInOutBox>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    paddingX: 0,
                    paddingTop: 0,
                    width: "100%",
                }}
                disableGutters>
                <Stack
                    component="form"
                    onSubmit={(e) => handleSubmit(e)}
                    sx={openedEventControlsFormSx}
                >
                    <Typography component="span" sx={openedEventSectionLabelSx}>
                        Attendance
                    </Typography>
                    
                    <Typography component="p" sx={openedEventControlsDescriptionSx}>
                        Let the organizer know whether you&apos;re going or still interested.
                    </Typography>


                    <Controller
                        name="status"
                        control={control}
                        render={() => (
                            <FormControl fullWidth>
                                <InputLabel
                                  id="attendance-interest-selector"
                                  sx={openedEventSelectLabelSx}
                                >
                                  Mark me as
                                </InputLabel>
                                <Select
                                    id="select-attendance-status"
                                    value={newStatus}
                                    label="Attendance"
                                    onChange={(e) => handleStatusChange(e)}
                                    labelId="attendance-interest-selector"
                                    sx={openedEventSelectSx}
                                    MenuProps={{
                                      PaperProps: {
                                        sx: openedEventMenuPaperSx,
                                      },
                                    }}
                                >
                                    {ATTENDANCE_OPTIONS.map((option) => (
                                        <MenuItem
                                            sx={{
                                                opacity: currentStatus === option.value ? 0.5 : 1
                                            }}
                                            key={option.label}
                                            value={option.value}
                                        >
                                            {(option.value === currentStatus) ? `${option.label} (current)` : option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    <FormControl >
                        <Button
                            startIcon={<UpdateIcon />}
                            disabled={newStatus === currentStatus}
                            type="submit"
                            variant="contained"
                            sx={openedEventPrimaryButtonSx}
                        >
                            Update My Attendance
                        </Button>
                    </FormControl>

                </Stack>
            </Container>
        </FadeInOutBox>

    )
}

