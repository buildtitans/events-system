"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { Group } from '../box/cards/group';
import { useMemo, useState } from 'react';

type CategoryMap = Map<string, string>;

function getCategoryName(category_id: string, map: CategoryMap): string | null {
    const name = map.get(category_id) ?? null;
    return name
};


export default function GroupCards(): React.JSX.Element {
    const groups = useSelector((s: RootState) => s.groups.communities);
    const categories = useSelector((s: RootState) => s.categories.categories);
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const categoryMap: CategoryMap = useMemo(() => {
        let map = new Map();
        categories.forEach((category) => {
            map.set(category.id, category.name)
        })
        return map
    }, [categories]);


    const handleFocus = (index: number) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Groups
            </Typography>
            <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
                {groups.map((group, index) => (
                    <Group
                        categoryName={getCategoryName(group.category_id, categoryMap)}
                        key={group.id}
                        group={group}
                        index={index}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                    />
                ))}
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                <Pagination hidePrevButton hideNextButton count={10} boundaryCount={10} />
            </Box>
        </div>
    );
}
