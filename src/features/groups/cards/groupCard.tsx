"use client"
import type { JSX } from "react";
import type { GroupSchemaType } from "@/src/schemas/groupSchema";
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { StyledCard, StyledCardContent, StyledTypography } from '@/src/styles/styledCard';
import { Author } from "@/src/components/ui/box/author";

type GroupCardProps = {
    focusedCardIndex: number | null,
    group: GroupSchemaType,
    handleFocus: (index: number) => () => void,
    handleBlur: () => void
}

function GroupCard({ focusedCardIndex, group, handleFocus }: GroupCardProps): JSX.Element {

    const { name, description, location } = group;

    const placeholder = [{
        name: name,
        avatar: "@/next.svg"
    }];

    return (
        <Grid size={{ xs: 12, md: 6 }}>
            <StyledCard
                variant="outlined"
                tabIndex={0}
                className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
            >
                <CardMedia
                    component="img"
                    alt="green iguana"
                    image={undefined}
                    sx={{
                        aspectRatio: '16 / 9',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                />
                <StyledCardContent>
                    <Typography gutterBottom variant="caption" component="div">
                        {location}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div">
                        {name}
                    </Typography>
                    <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                        {description}
                    </StyledTypography>
                </StyledCardContent>
                <Author authors={placeholder} />
            </StyledCard>
        </Grid>
    );
}


export { GroupCard };