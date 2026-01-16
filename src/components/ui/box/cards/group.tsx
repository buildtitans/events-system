import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { Author } from '../author';
import type { GroupSchemaType } from '@/src/schemas/groupSchema';





const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

const TitleTypography = styled(Typography)(({ theme }) => ({
    position: 'relative',
    textDecoration: 'none',
    '&:hover': { cursor: 'pointer' },
    '& .arrow': {
        visibility: 'hidden',
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
    },
    '&:hover .arrow': {
        visibility: 'visible',
        opacity: 0.7,
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '3px',
        borderRadius: '8px',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        width: 0,
        height: '1px',
        bottom: 0,
        left: 0,
        backgroundColor: (theme.vars || theme).palette.text.primary,
        opacity: 0.3,
        transition: 'width 0.3s ease, opacity 0.3s ease',
    },
    '&:hover::before': {
        width: '100%',
    },
}));

type GroupCardProps = {
    group: GroupSchemaType,
    index: number,
    handleFocus: (index: number) => void,
    handleBlur: () => void,
    focusedCardIndex: number | null,
    categoryName?: string | null
}


function Group({ index, group, handleFocus, handleBlur, focusedCardIndex, categoryName }: GroupCardProps): React.JSX.Element {


    return (
        <Grid size={{ xs: 12, sm: 6 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 1,
                    height: '100%',
                }}
            >
                <Typography gutterBottom variant="caption" component="div">
                    {categoryName}
                </Typography>
                <TitleTypography
                    gutterBottom
                    variant="h6"
                    onFocus={() => handleFocus(index)}
                    onBlur={handleBlur}
                    tabIndex={0}
                    className={focusedCardIndex === index ? 'Mui-focused' : ''}
                >
                    {group.name}
                    <NavigateNextRoundedIcon
                        className="arrow"
                        sx={{ fontSize: '1rem' }}
                    />
                </TitleTypography>
                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                    {group.description}
                </StyledTypography>

                <Author authors={[{ name: group.location ?? "Bloomington IL", avatar: "@/public/next.svg" }]} />
            </Box>
        </Grid>
    )
}

export { Group };