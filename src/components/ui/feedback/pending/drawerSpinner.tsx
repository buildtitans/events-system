import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function DrawerSpinner() {
    return (
        <Box sx={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    );
}
