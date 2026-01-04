import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import { Search } from "./search";

export function EventsSearch() {

    return (

        <Box
            sx={{
                display: { xs: 'none', sm: 'flex' },
                flexDirection: 'row',
                gap: 1,
                width: { xs: '100%', md: 'fit-content' },
                overflow: 'auto',
            }}
        >
            <Search />
            <IconButton size="small" aria-label="RSS feed">
                <RssFeedRoundedIcon />
            </IconButton>
        </Box>
    )
}