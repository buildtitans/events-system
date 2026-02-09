"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { CreateNewGroupHook } from '@/src/lib/hooks/insert/useCreateNewGroup';
import type { SelectChangeEvent } from "@mui/material/Select";


type SelectCategoryProps = {

    handleGroupCategory: CreateNewGroupHook["handleGroupCategory"],
    chosen: CreateNewGroupHook["newGroup"]["category_id"]
};

export default function SelectCategory({ handleGroupCategory }: SelectCategoryProps): React.JSX.Element {
    const [displayed, setDisplayed] = React.useState<string | null>("");
    const categories = useSelector((s: RootState) => s.categories.categories);

    const handleChange = (e: SelectChangeEvent<string | null>) => {
        const value = e.target.value;
        handleGroupCategory(value);
        setDisplayed(value);
    }


    return (
        <>
            <Box sx={{ width: 'auto', height: 'auto' }}>
                <FormControl fullWidth>
                    <InputLabel id="category-label">Categories</InputLabel>
                    <Select
                        sx={{
                            '& .MuiSelect-select': {
                                padding: '12px 14px',
                            },
                        }}

                        onChange={(e) => handleChange(e)}
                        labelId="category-label"
                        id="demo-simple-select"
                        value={displayed}
                        label="Categories"
                    >
                        {(Array.isArray(categories) && (categories.length > 0) && categories.map((cat) => (
                            <MenuItem
                                sx={{ color: 'white' }}
                                key={cat.id}
                                value={cat.id}
                            >
                                {cat.name}
                            </MenuItem>
                        )))}
                    </Select>
                </FormControl>
            </Box>
        </>

    );
}
