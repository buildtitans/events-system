import { EventSchemaType } from '@/src/schemas/events/eventSchema';
import { GroupSchemaType } from '@/src/schemas/groups/groupSchema';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { JSX } from 'react';
import GroupsIcon from '@mui/icons-material/Groups';


type CardFooterProps = {
    location?: EventSchemaType["meeting_location"] | GroupSchemaType["location"],
    authors?: { name: string; avatar: string }[],
    scheduled_at?: EventSchemaType["starts_at"],
    groupName?: GroupSchemaType["name"]
};


function CardFooter({
    scheduled_at,
    location,
    groupName
}: CardFooterProps): JSX.Element | null {

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
            {(location) && <Box
                sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
            >
                <LocationOnIcon fontSize='medium' />
                <Typography variant='caption'>
                    {location}
                </Typography>

            </Box>}

            {(groupName) &&
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
                >
                    <GroupsIcon />
                    <Typography variant='caption'>
                        {groupName}
                    </Typography>
                </Box>
            }
            <Typography variant="caption">{scheduled_at}</Typography>
        </Box>
    );
}

export { CardFooter };