"use client"
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledComponents/styledCard';
import { Author } from '@/src/components/ui/box/author';
import type { JSX } from 'react';
import type { EventSchemaType } from '@/src/schemas/eventSchema';

export type MobileEventCard = 12;

export type DesktopEventCard = 6 | 4;

export type EventCardSizes = {
    xs: MobileEventCard,
    md: DesktopEventCard
}

export type CardType =
    "hero"
    | "thumbnail"

export type CardDesignation = {
    size: EventCardSizes,
    type: CardType
}

export type EventCardProps = {
    handleFocus: (index: number) => void,
    handleBlur: () => void,
    focusedCardIndex: number,
    event: EventSchemaType,
    variant: CardDesignation,
    index: number,
    groupName: string
}

function EventCard({ handleFocus, handleBlur, focusedCardIndex, event, variant, index, groupName }: EventCardProps): JSX.Element {


    return (

        <Grid size={{
            xs: variant.size.xs,
            md: variant.size.md
        }}
        >

            <StyledCard
                variant="outlined"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === 2 ? 'Mui-focused' : ''}
                sx={{ height: '100%' }}
            >

                <CardMedia
                    component="img"
                    alt="green iguana"
                    image={event.img ?? undefined}
                    sx={{
                        height: { sm: 'auto', md: '50%' },
                        aspectRatio: { sm: '16 / 9', md: '' },
                    }}
                />


                <StyledCardContent>
                    <Typography gutterBottom variant="caption" component="div">
                        {groupName}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {event.title}
                    </Typography>
                    <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                        {event.description}
                    </StyledTypography>
                </StyledCardContent>
                <Author authors={event.authors} />
            </StyledCard>
        </Grid>
    )
}

export { EventCard };