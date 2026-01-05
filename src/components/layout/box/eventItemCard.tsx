"use client"
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledCard';
import { Author } from '@/src/components/layout/box/author';
import type { JSX } from 'react';
import { EventSchemaType } from '@/src/schemas/typebox/eventSchema';

export type EventItemCardProps = {
    handleFocus: (index: number) => void,
    handleBlur: () => void,
    focusedCardIndex: number | null,
    eventItemProperties: EventSchemaType
}

function EventItemCard({ focusedCardIndex, handleBlur, handleFocus, eventItemProperties }: EventItemCardProps): JSX.Element | null {

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <StyledCard
                variant="outlined"
                onFocus={() => handleFocus(0)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
            >
                <CardMedia
                    component="img"
                    alt="green iguana"
                    image={eventItemProperties.img}
                    sx={{
                        aspectRatio: '16 / 9',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                />
                <StyledCardContent>
                    <Typography gutterBottom variant="caption" component="div">
                        {eventItemProperties.tag}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {eventItemProperties.title}
                    </Typography>
                    <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                        {eventItemProperties.description}
                    </StyledTypography>
                </StyledCardContent>
                <Author authors={eventItemProperties?.authors} />
            </StyledCard>
        </Grid>
    );
}

export { EventItemCard }; 