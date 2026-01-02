import Box from "@mui/material/Box"
import { Search } from "@/src/features/search"
import IconButton from "@mui/material/IconButton"
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';

function MobileEventsSearch() {

    return (
        <Box
            id="LANDING_SUB_NAV"
            sx={{
                border: '2px solid red',
                display: { xs: 'flex', sm: 'none' },
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
};

export { MobileEventsSearch };