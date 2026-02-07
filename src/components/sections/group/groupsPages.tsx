"use client"
import type { JSX } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GroupsPaginaton from '../../ui/box/pagination/groupsPagination';
import { GroupsPage } from './groupsPage';
import { AnimatePresence } from 'framer-motion';
import { useGroupPages } from '@/src/lib/hooks/rendering/useGroupPages';
import { useRouter } from "next/navigation";
import { useCallback } from 'react';
import { GroupSchemaType, GroupsSchemaType } from '@/src/schemas/groupSchema';

export type CategoryMap = Map<string, string>;

export default function GroupsPagesContainer({ groupsPages }: { groupsPages: GroupsSchemaType[] }): JSX.Element | null {
    const {
        currentPage,
        categoryMap,
        columns
    } = useGroupPages(groupsPages);
    const router = useRouter();

    const handleGroupClicked = useCallback((
        slug: GroupSchemaType["slug"]
    ) => {

        return () => {
            const route = `/group/${slug}`
            router.push(route)
        }
    }, []);

    if (!groupsPages[currentPage]) return null;

    return (
        <div>
            <Typography variant="h2" gutterBottom>
                Groups
            </Typography>
            <AnimatePresence mode='wait'>
                {
                    (groupsPages[currentPage]) &&
                    <GroupsPage
                        handleGroupClicked={handleGroupClicked}
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
