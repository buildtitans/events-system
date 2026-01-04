"use client"
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { cardData } from '@/src/lib/tokens/cardTokens';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledCard';
import { Author } from '@/src/features/author';
import { useState } from 'react';
import type { JSX } from 'react';

function EventCards(): JSX.Element | null {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);

    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    return (
        <Grid container spacing={2} columns={12}>
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
                        image={cardData[0].img}
                        sx={{
                            aspectRatio: '16 / 9',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                    <StyledCardContent>
                        <Typography gutterBottom variant="caption" component="div">
                            {cardData[0].tag}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {cardData[0].title}
                        </Typography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardData[0].description}
                        </StyledTypography>
                    </StyledCardContent>
                    <Author authors={cardData[0].authors} />
                </StyledCard>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <StyledCard
                    variant="outlined"
                    onFocus={() => handleFocus(1)}
                    onBlur={handleBlur}
                    tabIndex={0}
                    className={focusedCardIndex === 1 ? 'Mui-focused' : ''}
                >
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        image={cardData[1].img}
                        aspect-ratio="16 / 9"
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        }}
                    />
                    <StyledCardContent>
                        <Typography gutterBottom variant="caption" component="div">
                            {cardData[1].tag}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {cardData[1].title}
                        </Typography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardData[1].description}
                        </StyledTypography>
                    </StyledCardContent>
                    <Author authors={cardData[1].authors} />
                </StyledCard>
            </Grid>
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
                        image={cardData[2].img}
                        sx={{
                            height: { sm: 'auto', md: '50%' },
                            aspectRatio: { sm: '16 / 9', md: '' },
                        }}
                    />
                    <StyledCardContent>
                        <Typography gutterBottom variant="caption" component="div">
                            {cardData[2].tag}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {cardData[2].title}
                        </Typography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardData[2].description}
                        </StyledTypography>
                    </StyledCardContent>
                    <Author authors={cardData[2].authors} />
                </StyledCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}
                >
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
                                    {cardData[3].tag}
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    {cardData[3].title}
                                </Typography>
                                <StyledTypography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {cardData[3].description}
                                </StyledTypography>
                            </div>
                        </StyledCardContent>
                        <Author authors={cardData[3].authors} />
                    </StyledCard>
                    <StyledCard
                        variant="outlined"
                        onFocus={() => handleFocus(4)}
                        onBlur={handleBlur}
                        tabIndex={0}
                        className={focusedCardIndex === 4 ? 'Mui-focused' : ''}
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
                                    {cardData[4].tag}
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    {cardData[4].title}
                                </Typography>
                                <StyledTypography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    {cardData[4].description}
                                </StyledTypography>
                            </div>
                        </StyledCardContent>
                        <Author authors={cardData[4].authors} />
                    </StyledCard>
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
                        image={cardData[5].img}
                        sx={{
                            height: { sm: 'auto', md: '50%' },
                            aspectRatio: { sm: '16 / 9', md: '' },
                        }}
                    />
                    <StyledCardContent>
                        <Typography gutterBottom variant="caption" component="div">
                            {cardData[5].tag}
                        </Typography>
                        <Typography gutterBottom variant="h6" component="div">
                            {cardData[5].title}
                        </Typography>
                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                            {cardData[5].description}
                        </StyledTypography>
                    </StyledCardContent>
                    <Author authors={cardData[5].authors} />
                </StyledCard>
            </Grid>
        </Grid>
    )
}

export default EventCards;