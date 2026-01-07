"use client"
import Typography from '@mui/material/Typography';
import { cardData } from '@/src/lib/tokens/eventTokens';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledCard';
import { Author } from '@/src/components/layout/box/author';
import { EventItemCardProps } from "./eventItemCard";

function BlogCard({ handleBlur, handleFocus, focusedCardIndex }: EventItemCardProps) {

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
    )
}

export { BlogCard }