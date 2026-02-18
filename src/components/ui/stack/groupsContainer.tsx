"use client"
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import GroupsPagesContainer from "@/src/components/sections/group/groupsPages";
import { chunkGroupsIntoPages } from '@/src/lib/utils/helpers/chunk/chunkGroupsIntoPages';
import { useMemo } from 'react';

function GroupsContainer(): JSX.Element | null {
    const groups = useSelector((s: RootState) => s.groups.communities);
    const groupsPages = useMemo(() => {
        return chunkGroupsIntoPages(groups);
    }, [groups]);


    return (
        <GroupsPagesContainer groupsPages={groupsPages} />
    )
};

export default GroupsContainer;