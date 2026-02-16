import { EventSchemaType } from '@/src/schemas/events/eventSchema';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { JSX } from 'react';

type CardFooterProps = {
    location?: EventSchemaType["meeting_location"],
    authors: { name: string; avatar: string }[],
    scheduled_at?: EventSchemaType["starts_at"]
}

function CardFooter({ authors, scheduled_at, location }: CardFooterProps): JSX.Element | null {

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
            }}
        >
            <Box
                sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
            >
                <LocationOnIcon fontSize='medium' />
                <Typography variant='caption'>
                    {location}
                </Typography>

            </Box>
            <Typography variant="caption">{scheduled_at}</Typography>
        </Box>
    );
}

export { CardFooter };