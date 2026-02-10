"use client";
import { type JSX } from "react";
import Container from "@mui/material/Container";
import { useForm, Controller } from 'react-hook-form';
import { useUpdateAttendance } from "@/src/lib/hooks/update/useUpdateEventStatus";
import { EventAttendantStatusSchemaType } from "@/src/schemas/eventAttendantsSchema";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { ATTENDANCE_OPTIONS } from "@/src/lib/tokens/attentanceStatusTokens";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import Button from "@mui/material/Button";
import UpdateIcon from '@mui/icons-material/Update';
import FadeInOutBox from "../../ui/box/motionboxes/fadeInOutBox";
import InputLabel from '@mui/material/InputLabel';
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";

type UpdateViewerAttendanceFormProps = {
    currentStatus: EventAttendantStatusSchemaType, event_id: EventSchemaType["id"],

    role: GroupMembersSchemaType["role"]

}

type UpdateAttendanceStatusForm = {
    status: EventAttendantStatusSchemaType | null,
}

export default function UpdateViewerAttendanceForm({
    currentStatus,
    event_id,
    role
}: UpdateViewerAttendanceFormProps
): JSX.Element {
    const { control } = useForm<UpdateAttendanceStatusForm>();
    const {
        newStatus,
        handleStatusChange,
        handleSubmit
    } = useUpdateAttendance(currentStatus, event_id, role);


    return (
        <FadeInOutBox>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    paddingX: 3,
                    paddingTop: 2
                }}
                disableGutters>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    style={{
                        width: '450px',
                        height: '100%',
                        gap: 16,
                        display: 'flex',
                        flexDirection: 'column',

                    }}
                >


                    <Controller
                        name="status"
                        control={control}
                        render={() => (
                            <FormControl fullWidth>
                                <InputLabel id="attendance-interest-selector">Mark me as</InputLabel>
                                <Select
                                    id="select-attendance-status"
                                    value={newStatus}
                                    label="Attendance"
                                    onChange={(e) => handleStatusChange(e)}
                                    labelId="attendance-interest-selector"
                                >
                                    {ATTENDANCE_OPTIONS.map((option) => (
                                        <MenuItem
                                            key={option.label}
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

