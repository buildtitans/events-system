"use client"
import { useCallback, useState } from 'react';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import GroupCards from './groupsContainer';


function GroupsContainer(): JSX.Element | null {
    const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
    const groups = useSelector((s: RootState) => s.groups.communities);

    const handleFocus = useCallback((index: number) => {
        return () => {
            setFocusedCardIndex(index);
        }
    }, []);

    const handleBlur = useCallback((): void => {
        setFocusedCardIndex(null);
    }, []);

    if (groups.length < 1) return null;

    return (
        <GroupCards />
    )
};

export default GroupsContainer;