"use client"
import React, { useMemo } from 'react';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledComponents/styledCard';
import { CardFooter } from '@/src/components/ui/box/cards/cardFooter';
import type { JSX } from 'react';
import type { EventSchemaType } from '@/src/schemas/events/eventSchema';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import EventCancelledOverlay from '../../feedback/info/eventCancelledOverlay';
dayjs.extend(utc);

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
    focusedCardIndex: number | null,
    event: EventSchemaType,
    variant: CardDesignation,
    index: number,
    groupName: string,
    handleOpenEvent: (event: EventSchemaType) => () => void
}

function EventHeroCard(
    {
        handleFocus,
        handleBlur,
        focusedCardIndex,
        event,
        variant,
        index,
        groupName,
        handleOpenEvent
    }: EventCardProps
): JSX.Element {
    const scheduled_at = useMemo(() => {
        const utcDate = dayjs(event.starts_at).utc().toDate().toDateString();
        const string_date = dayjs(utcDate).format('MMMM D, YYYY h:mm A');
        return string_date;
    }, [event])


    return (
        <Grid size={{
            xs: variant.size.xs,
            md: variant.size.md
        }}
        >

            <StyledCard
                onClick={handleOpenEvent(event)}
                variant="outlined"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === 2 ? 'Mui-focused' : ''}
                sx={{ height: '100%', opacity: (event.status === "cancelled") ? "55%" : "100%" }}
            >

                <Box sx={{
                    position: "relative",
                    height: { sm: 'auto', md: '50%' }
                }}>
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        image={event.img ?? undefined}
                        sx={{
                            height: "100%",
                            aspectRatio: { sm: '16 / 9', md: '' },
                            filter: event.status === "cancelled" ? "grayscale(40%)" : "none"

                        }}
                    />

                    {event.status === "cancelled" && (
                        <EventCancelledOverlay />
                    )}

                </Box>


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
                <CardFooter authors={event.authors} scheduled_at={scheduled_at} location={event.meeting_location} />
            </StyledCard>
        </Grid>
    )
}

export default React.memo(EventHeroCard);