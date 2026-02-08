"use client"
import Typography from '@mui/material/Typography';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledComponents/styledCard';
import { Author } from '@/src/components/ui/box/author';
import { EventCardProps } from './cards/eventCard';
import type { EventSchemaType } from '@/src/schemas/eventSchema';

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
                }}
            >
                <div>
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
                </div>
            </StyledCardContent>
            <Author authors={event.authors} />
        </StyledCard>
    )
}

export { EventStackCard };