"use client"
import Box from '@mui/material/Box';
import type { JSX } from 'react';
import { ActiveCategory } from '@/src/features/events/activeCategory';
import { MobileEventsSearch } from '@/src/components/ui/nav/landingSubNav';
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
                <ActiveCategory />
            </Box>
        </Container>
    )
}