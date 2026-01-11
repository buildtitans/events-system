"use client"
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { EventStackCard } from '../eventStackCard';
import { CardDesignation, EventCardProps } from '../cards/eventCard';

type EventStackSlotProps = {
    handleBlur: EventCardProps["handleBlur"],
    handleFocus: EventCardProps["handleFocus"],
    focusedCardIndex: EventCardProps["focusedCardIndex"],
    events: EventCardProps["event"][],
}

function EventStackSlot({
    handleBlur,
    handleFocus,
    focusedCardIndex,
    events,
}: EventStackSlotProps): React.ReactNode {

    return (
        <Grid size={{ xs: 12, md: 4 }}>
            <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
            >
                <EventStackCard
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                    event={events[0]}
                />
                <EventStackCard
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                    event={events[1]}
                />

            </Box>
        </Grid>
    )
}


export { EventStackSlot };