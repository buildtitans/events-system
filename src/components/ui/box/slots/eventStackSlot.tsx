"use client"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { EventStackCard } from '../eventStackCard';
import { EventCardProps } from '../cards/eventCard';
import { GroupNameByGroupID } from '@/src/lib/store/slices/EventsSlice';

type EventStackSlotProps = {
    handleBlur: EventCardProps["handleBlur"],
    handleFocus: EventCardProps["handleFocus"],
    focusedCardIndex: EventCardProps["focusedCardIndex"],
    events: EventCardProps["event"][],
    groupNamesById: GroupNameByGroupID
}

function EventStackSlot({
    handleBlur,
    handleFocus,
    focusedCardIndex,
    events,
    groupNamesById
}: EventStackSlotProps): React.ReactNode {

    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
            >   {events.map((event) => (
                <EventStackCard
                    key={event.id}
                    groupName={groupNamesById[event.group_id]}
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                    event={event}
                />

            ))}

            </Box>
        </Grid>
    )
}


export { EventStackSlot };