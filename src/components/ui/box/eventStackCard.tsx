"use client"
import Typography from '@mui/material/Typography';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledCard';
import { Author } from '@/src/components/layout/box/author';
import { EventItemCardProps } from "./eventItemCard";
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';

function EventStackCard({ handleBlur, handleFocus, focusedCardIndex }: EventItemCardProps) {
    const events = useSelector((s: RootState) => s.events.events);

    return (
        <StyledCard
            variant="outlined"
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
                        {events[3].tag}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {events[3].title}
                    </Typography>
                    <StyledTypography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        {events[3].description}
                    </StyledTypography>
                </div>
            </StyledCardContent>
            <Author authors={events[3].authors} />
        </StyledCard>
    )
}

export { EventStackCard };