"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { useMemo, } from 'react';
import { chunkGroupsIntoPages } from '@/src/lib/utils/helpers/chunkGroupsIntoPages';
import GroupsPaginaton from '../box/pagination/groupsPagination';
import { GroupsPage } from './groupsPage';
import { AnimatePresence } from 'framer-motion';

export type CategoryMap = Map<string, string>;

export default function GroupCards(): React.JSX.Element {
    const groups = useSelector((s: RootState) => s.groups.communities);
    const groupsPages = useMemo(() => {
        return chunkGroupsIntoPages(groups);
    }, [groups]);
    const categories = useSelector((s: RootState) => s.categories.categories);
    const currentPage = useSelector((s: RootState) => s.groups.currentPage);
    const columns = groupsPages[currentPage].length > 1 ? 2 : 1;
    const categoryMap: CategoryMap = useMemo(() => {
        let map: CategoryMap = new Map();
        categories.forEach((category) => {
            map.set(category.id, category.name)
        });
        return map;
    }, [categories]);


    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Groups
            </Typography>
            <AnimatePresence mode='wait'>
                {
                    (groupsPages[currentPage]) &&
                    <GroupsPage
                        key={groupsPages[currentPage][0].id}
                        page={groupsPages[currentPage]}
                        categoryMap={categoryMap}
                        columns={columns} />
                }
            </AnimatePresence>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                <GroupsPaginaton numButtons={groupsPages.length} />
            </Box>
        </div>
    );
}
