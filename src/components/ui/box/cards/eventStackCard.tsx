"use client"
import Typography from '@mui/material/Typography';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledComponents/styledCard';
import { Author } from '@/src/components/ui/box/cards/author';
import { EventCardProps } from './eventCard';
import type { EventSchemaType } from '@/src/schemas/eventSchema';
import Box from '@mui/material/Box';
import EventCancelledOverlay from '../../feedback/info/eventCancelledOverlay';

type EventStackCardProps = {
    handleBlur: EventCardProps["handleBlur"],
    handleFocus: EventCardProps["handleFocus"],
    focusedCardIndex: EventCardProps["focusedCardIndex"],
    event: EventCardProps["event"],
    groupName: string,
    handleOpenEvent: (event: EventSchemaType) => () => void
}

function EventStackCard({ handleBlur, handleFocus, focusedCardIndex, event, groupName, handleOpenEvent }: EventStackCardProps) {


    return (
        <StyledCard
            variant="outlined"
            onClick={handleOpenEvent(event)}
            onFocus={() => handleFocus(3)}
            onBlur={handleBlur}
            tabIndex={0}
            className={focusedCardIndex === 3 ? 'Mui-focused' : ''}
            sx={{ height: '100%' }}
        >
            <StyledCardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    position: "relative"
                }}
            >
                {(event.status === "cancelled") && <EventCancelledOverlay />}


                <Box sx={{
                    position: "relative",
                    height: '100%',
                    width: '100%',
                    filter: (event.status === "cancelled" ? "grayscale(40%)" : "none")
                }}>
                    <Typography gutterBottom variant="caption" component="div">
                        {groupName}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {event.title}
                    </Typography>
                    <StyledTypography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        {event.description}
                    </StyledTypography>
                </Box>
            </StyledCardContent>
            <Author authors={event.authors} />
        </StyledCard>
    )
}

export { EventStackCard };