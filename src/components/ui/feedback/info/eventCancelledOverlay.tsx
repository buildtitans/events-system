import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CancelIcon from "@mui/icons-material/Cancel";
import type { JSX } from 'react';

export default function EventCancelledOverlay(): JSX.Element | null {

    return (

        <Box
            sx={{
                position: "absolute",
                inset: 0,
                background:
                    "linear-gradient(to bottom, rgba(0,0,0,.1), rgba(0,0,0,.65))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Chip
                label="Cancelled"
                color="error"
                icon={<CancelIcon />}
                sx={{ fontWeight: 600, letterSpacing: 1 }}
            />
        </Box>
    )
}