"use client"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Autocomplete from '@mui/material/Autocomplete';
import { useDebouncedSerach } from '@/src/lib/hooks/search/useDebouncedSearch';
import { searchBarSx } from '@/src/styles/sx/sx';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';


//TODO: build out an 'expanded event' section in the @/src/app/group/[slug] route, to have an actionable click event when the user selects a search option

export function Search() {
  const mountStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);
    const { 
        suggestions, 
        input, 
        onInputChange, 
       // status, 
       // message 
    } = useDebouncedSerach();

    return (
        <Autocomplete
        clearOnEscape
        disabled={mountStatus !== "idle"}
        inputValue={input}
        onInputChange={onInputChange}
        getOptionLabel={(option) => `${option.kind === "event" ? "Event:" : "Group:"} ${option.label}`}
  disablePortal
  options={suggestions}
  renderInput={(params) => (
    <OutlinedInput
      {...params.InputProps}
      inputProps={{
        ...params.inputProps,
        'aria-label': 'search',
      }}
      placeholder="Search…"
      startAdornment={
        <>
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
          {params.InputProps.startAdornment}
        </>
      }
      sx={searchBarSx}
      size="small"
    />
  )}
/>
    )
}