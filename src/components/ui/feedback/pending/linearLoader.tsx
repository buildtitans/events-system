"use client"
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import FadeInOutBox from '../../box/fadeInOutBox';

function LinearIndeterminate() {
    return (
        <Box sx={{
            width: '100%',
            height: '400px',
            margin: 'auto',
            paddingTop: '20px',
            zIndex: 100
        }}>
            <LinearProgress />
        </Box>
    );
}

export { LinearIndeterminate }