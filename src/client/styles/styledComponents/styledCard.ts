import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from '@mui/material/Card';

const StyledCard = styled(Card)(() => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: 'transparent',
    transition: 'ease-in-out',
    transitionDuration: '200ms',
    '&:hover': {
        cursor: 'pointer',

    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    },
}));

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: 1.65,
});

export {
    StyledCardContent,
    StyledTypography,
    StyledCard
};
