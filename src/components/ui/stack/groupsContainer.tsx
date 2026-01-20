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
import { GroupSchemaType } from '@/src/schemas/groupSchema';
import { chunkGroupsIntoPages } from '@/src/lib/utils/helpers/chunkGroupsIntoPages';
import GroupsPaginaton from '../box/pagination/groupsPagination';

type CategoryMap = Map<string, string>;

function getCategoryName(category_id: GroupSchemaType["category_id"], map: CategoryMap): string | null {
    if (!category_id) return null;
    const name = map.get(category_id) ?? null;
    return name
};




export default function GroupCards(): React.JSX.Element {
    const groups = useSelector((s: RootState) => s.groups.communities);
    const groupsPages = useMemo(() => {
        return chunkGroupsIntoPages(groups);
    }, [groups]);
    const categories = useSelector((s: RootState) => s.categories.categories);
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const currentPage = useSelector((s: RootState) => s.groups.currentPage);
    const columns = groupsPages[currentPage].length > 1 ? 2 : 1;
    const categoryMap: CategoryMap = useMemo(() => {
        let map: CategoryMap = new Map();
        categories.forEach((category) => {
            map.set(category.id, category.name)
        });
        return map;
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
            <Grid container spacing={2} columns={columns} sx={{ minHeight: 600 }}>
                {groupsPages[currentPage].map((group, index) => (
                    <Group
                        key={group.id}
                        categoryName={getCategoryName(group.category_id, categoryMap)}
                        group={group}
                        index={index}
                        handleBlur={handleBlur}
                        handleFocus={handleFocus}
                        focusedCardIndex={focusedCardIndex}
                    />

                ))}
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                <GroupsPaginaton numButtons={groupsPages.length} />
            </Box>
        </div>
    );
}
