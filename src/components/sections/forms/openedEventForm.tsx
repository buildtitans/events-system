"use client";
import { type JSX } from "react";
import Container from "@mui/material/Container";
import { useForm, Controller } from 'react-hook-form';
import { useUpdateEventStatus } from "@/src/lib/hooks/update/useUpdateEventStatus";
import { EventAttendantStatusSchemaType } from "@/src/schemas/eventAttendantsSchema";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ATTENDANCE_OPTIONS } from "@/src/lib/tokens/attentanceStatusTokens";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import UpdateIcon from '@mui/icons-material/Update';
import FadeInOutBox from "../../ui/box/fadeInOutBox";

type UpdateAttendanceStatusForm = {
    status: EventAttendantStatusSchemaType | null
}

export default function UpdateViewerAttendanceForm(
    {
        currentStatus,
        event_id
    }: {
        currentStatus: EventAttendantStatusSchemaType,
        event_id: EventSchemaType["id"]
    }): JSX.Element {
    const {
        newStatus,
        handleStatusChange,
        handleSubmit
    } = useUpdateEventStatus(currentStatus, event_id);
    const { control } = useForm<UpdateAttendanceStatusForm>();

    console.log(newStatus)

    return (
        <FadeInOutBox>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                disableGutters>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    style={{
                        width: '450px',
                        height: '100%',
                        gap: 40,
                        display: 'flex',
                        flexDirection: 'column',

                    }}
                >
                    <Typography
                        component={"h2"}
                        sx={{
                            fontSize: '26px',
                            borderBottom: 1,
                            borderColor: 'rgb(255, 255, 255, 0.15)'
                        }}
                    >
                        Attendance Status
                    </Typography>

                    <Controller
                        name="status"
                        control={control}
                        render={() => (
                            <FormControl>
                                <Select
                                    id="select-attendance-status"
                                    value={newStatus}
                                    label="Attendance"
                                    onChange={(e) => handleStatusChange(e)}
                                >
                                    {ATTENDANCE_OPTIONS.map((option) => (
                                        <MenuItem
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    <FormControl >
                        <Button
                            startIcon={<UpdateIcon />}
                            disabled={false}
                            type="submit"
                            variant="contained"
                        >
                            Update My Attendance
                        </Button>
                    </FormControl>

                </form>
            </Container>
        </FadeInOutBox>

    )
}

