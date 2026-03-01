"use client"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Autocomplete from '@mui/material/Autocomplete';
import { useDebouncedSerach } from '@/src/lib/hooks/search/useDebouncedSearch';
import { searchBarSx } from '@/src/styles/sx/sx';

export function Search() {
    const { 
        suggestions, 
        input, 
        onInputChange, 
        status, 
        message 
    } = useDebouncedSerach();

    return (
        <Autocomplete
        inputValue={input}
        onInputChange={onInputChange}
        getOptionLabel={(option) => option.title}
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

//export function Search({ input }: { input: string}) {
//    return (
//        <OutlinedInput
//            value={input}
//            size="small"
//            id="search"
//            placeholder="Search…"
//            autoComplete="off"
//            sx={searchBarSx}
//            startAdornment={
//                <InputAdornment position="start" sx={{ color: 'text.primary' }}>
//                    <SearchRoundedIcon fontSize="small" />
//                </InputAdornment>
//            }
//            inputProps={{
//                'aria-label': 'search',
//            }}
//        />
//
//    );
//}
//

