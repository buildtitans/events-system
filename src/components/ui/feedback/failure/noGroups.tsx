import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NotFound } from './notFound';
import type { JSX } from 'react';

export default function NoGroups(): JSX.Element {

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            height: '300px',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        }} >
            <NotFound />
            <Typography component={"h4"} color="info">
                No groups found
            </Typography>
        </Box>
    )
}