"use client"
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledCard';
import { Author } from '@/src/components/layout/box/author';
import { useState } from 'react';
import type { JSX } from 'react';
import { EventItemCard } from '../box/eventItemCard';
import { BlogCard } from '../box/blogCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';

function EventCards(): JSX.Element | null {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const events = useSelector((s: RootState) => s.categories.events);
    if ((!events) || (events.length === 0)) return null;
    const top = events.slice(0, 2);

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };


    return (
        <Grid container spacing={2} columns={12}>
            {((events.length > 0) && (top.length > 0)) && top.map((card) => (
                <EventItemCard
                    key={card.id ?? card.description}
                    eventItemProperties={card}
                    handleBlur={handleBlur}
                    handleFocus={handleFocus}
                    focusedCardIndex={focusedCardIndex}
                />
            ))}

            <Grid size={{ xs: 12, md: 4 }}>
                <StyledCard
                    variant="outlined"
                    onFocus={() => handleFocus(2)}
                    onBlur={handleBlur}
                    tabIndex={0}
                    className={focusedCardIndex === 2 ? 'Mui-focused' : ''}
                    sx={{ height: '100%' }}
                >
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        image={events[2].img ?? undefined}
                        sx={{
                            height: { sm: 'auto', md: '50%' },
                            aspectRatio: { sm: '16 / 9', md: '' },
                        }}
                    />
                    <StyledCardContent>
                        <Typography gutterBottom variant="caption" component="div">
                            {events[2].tag}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {events[2].title}
                        </Typography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {events[2].description}
                        </StyledTypography>
                    </StyledCardContent>
                    <Author authors={events[2].authors} />
                </StyledCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
                >
                    <BlogCard
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                        eventItemProperties={events[3]}
                    />
                    <BlogCard
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                        eventItemProperties={events[4]}
                    />

                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <StyledCard
                    variant="outlined"
                    onFocus={() => handleFocus(5)}
                    onBlur={handleBlur}
                    tabIndex={0}
                    className={focusedCardIndex === 5 ? 'Mui-focused' : ''}
                    sx={{ height: '100%' }}
                >
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        image={events[5].img ?? undefined}
                        sx={{
                            height: { sm: 'auto', md: '50%' },
                            aspectRatio: { sm: '16 / 9', md: '' },
                        }}
                    />
                    <StyledCardContent>
                        <Typography gutterBottom variant="caption" component="div">
                            {events[5].tag}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {events[5].title}
                        </Typography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {events[5].description}
                        </StyledTypography>
                    </StyledCardContent>
                    <Author authors={events[5].authors} />
                </StyledCard>
            </Grid>
        </Grid>
    )
}

export default EventCards;