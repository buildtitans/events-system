import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

function LinearLoader() {
    return (

        <Stack
            sx={{
                height: "500px",
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <Box
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: "100%"
                }}
            >
                <LinearProgress />
            </Box>
        </Stack>

    );
}

export { LinearLoader }