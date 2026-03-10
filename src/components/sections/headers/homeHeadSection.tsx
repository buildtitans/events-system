"use client"
import Box from '@mui/material/Box';
import type { JSX } from 'react';
import { CategoryChips } from '@/src/features/events/categoryChips';
import { MobileEventsSearch } from '@/src/components/global/nav/landingSubNav';
import { LandingHeader } from '@/src/components/ui/typography/landingHeader';
import { overrides } from '@/src/styles/sx/sx';
import Container from '@mui/material/Container';


export default function HomeHeadSection(): JSX.Element {


    return (
        <Container>
            <LandingHeader />
            <MobileEventsSearch />
            <Box
                sx={overrides}
            >
                <CategoryChips />
            </Box>
        </Container>
    )
}