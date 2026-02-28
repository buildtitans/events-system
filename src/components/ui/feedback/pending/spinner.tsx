import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Spinner() {
    return (
        <Box sx={{ position: 'fixed', display: 'flex', height: '100svh', width: '100svw', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    );
};


export function RelativeSpinner() {

    return (
        <Box sx={{ position: 'relative', display: 'flex', height: '600px', width: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>
    )
}
