"use client";
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from "react-redux";
import type { RootState } from "@/src/lib/store";
import { CreateNewGroupHook } from '@/src/lib/hooks/useCreateNewGroup';
import CategoryItem from '@/src/components/ui/lists/categoryItem';

type SelectCategoryProps = {

    handleGroupCategory: CreateNewGroupHook["handleGroupCategory"]
};

export default function SelectCategory({ handleGroupCategory }: SelectCategoryProps): React.JSX.Element {
    const [age, setAge] = React.useState('');
    const categories = useSelector((s: RootState) => s.categories.categories);

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    return (
        <Box sx={{ width: 'auto', height: 'auto' }}>
            <FormControl fullWidth>
                <InputLabel id="category-label">Categories</InputLabel>
                <Select
                    sx={{
                        '& .MuiSelect-select': {
                            padding: '12px 14px',
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 300,
                                bgcolor: 'black',
                                color: 'white'
                            },
                        },
                    }}
                    labelId="category-label"
                    id="demo-simple-select"
                    value={age}
                    label="Categories"
                    onChange={handleChange}
                >
                    {(Array.isArray(categories) && (categories.length > 0) && categories.map((cat) => (
                        <CategoryItem key={cat.id} id={cat.id} name={cat.name} handleGroupCategory={handleGroupCategory} />
                    )))}
                </Select>
            </FormControl>
        </Box>
    );
}
