"use client"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { JSX } from 'react';
import { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import { navSearchInputSx } from '@/src/client/styles/sx/nav';

type SearchBarProps = {
    params: AutocompleteRenderInputParams
}

export default function SearchBar({ params }: SearchBarProps): JSX.Element {

    return (
        <OutlinedInput
        suppressHydrationWarning={true}
      autoComplete={"off"}
      {...params.InputProps}
      inputProps={{
        ...params.inputProps,
        'aria-label': 'search',
      }}
      placeholder="Search…"
      startAdornment={
        <>
          <InputAdornment position="start" sx={{ color: 'rgba(255, 255, 255, 0.58)' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
          {params.InputProps.startAdornment}
        </>
      }
      sx={navSearchInputSx}
      size="small"
    />
    )
}
