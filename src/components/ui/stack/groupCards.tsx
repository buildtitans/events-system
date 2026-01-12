"use client"
import Grid from '@mui/material/Grid';
import { useCallback, useState } from 'react';
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { GroupSchemaType } from '@/src/schemas/groupSchema';
import { GroupCard } from '@/src/features/groups/cards/groupCard';
import Latest from './groupsAvailable';


function GroupCards(): JSX.Element | null {
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
        <Latest />
    )
};

export default GroupCards;