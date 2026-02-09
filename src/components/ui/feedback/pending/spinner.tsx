"use client";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
    return (
        <Box sx={{ display: 'flex', height: '100svh', width: '100svw', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    );
}
