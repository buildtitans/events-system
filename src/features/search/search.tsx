"use client"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

//TODO: implement search hook w/debounced query on new input/onChange

export function Search() {
    return (
        <OutlinedInput
            value={""}
            size="small"
            id="search"
            placeholder="Search…"
            autoComplete="off"
            sx={{
                transition: 'ease-in-out',
                transitionDuration: '200ms',
                borderRadius: 999,
                xs: '100%', md: '25ch'
            }}
            startAdornment={
                <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                    <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
            }
            inputProps={{
                'aria-label': 'search',
            }}
        />

    );
}
