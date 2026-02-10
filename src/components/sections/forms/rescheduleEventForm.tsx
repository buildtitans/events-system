"use client";
import { useCancelEvent } from "@/src/lib/hooks/update/useCancelEvent";
import { EventSchemaType } from "@/src/schemas/eventSchema";
import Button from "@mui/material/Button";
import { CheckCancelEventButton } from "../../ui/buttons/CheckCancelEventButton";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";
import Container from "@mui/material/Container";
import ConfirmCancelEventPopover from "../../ui/modals/confirmCancelEventPopover";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import CancelIcon from '@mui/icons-material/Cancel';

type RescheduleEventFormProps = {
    event: EventSchemaType
}

export default function RescheduleEventForm({ event }: RescheduleEventFormProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const groups = useSelector((s: RootState) => s.groups.communities);
    const organizer_id = useMemo(() => {
        const currentGroup = groups.find((grp) => grp.id === event.group_id);
        if (!currentGroup) return;
        return currentGroup?.organizer_id;
    }, [groups, event.group_id])
    const {
        handleStatusChange,
        handleSubmit,
        options
    } = useCancelEvent(event, organizer_id);


    const closePopover = () => {
        setAnchorEl(null)
    }

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 12,
                width: '100%',
            }}
        >

            <form
                style={{
                    width: '100%',
                    height: 'auto',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 40,
                }}
            >
                <CheckCancelEventButton
                    handleStatusChange={handleStatusChange}
                    newStatus={options.status}
                    currentStatus={event.status}
                />

                <ConfirmCancelEventPopover
                    anchorEl={anchorEl}
                    handleSubmit={handleSubmit}
                    onClose={closePopover}
                    currentStatus={event.status}
                />
                {(event.status !== options.status) && <Button
                    type="button"
                    variant="contained"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        width: "100%"
                    }}
                    startIcon={(event.status === "scheduled") ? (<CancelIcon />) : (<SettingsBackupRestoreIcon />)}
                >
                    {(event.status === "scheduled") ? "Confirm Cancellation" : "Confirm Rescind Cancellation"}
                </Button>}
            </form>
        </Container>

    )
}   