import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { openedEventSpinnerSx } from '@/src/client/styles/sx/openedEventDrawer';

export default function DrawerSpinner() {
    return (
        <Box sx={openedEventSpinnerSx}>
            <CircularProgress />
        </Box>
    );
}
