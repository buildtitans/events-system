"use client"
import Box from '@mui/material/Box';
import type { JSX } from 'react';
import { CategoryChips } from '@/src/features/events/categoryChips';
import { LandingHeader } from '@/src/components/ui/typography/landingHeader';
import { overrides } from '@/src/styles/sx/sx';
import Container from '@mui/material/Container';


export default function HomeHeadSection({ isMobile }: {isMobile: boolean}): JSX.Element {

  console.log(isMobile)

    return (
        <Container>
            <LandingHeader 
            isMobile={isMobile}
            />
            <Box
                sx={overrides}
            >
                <CategoryChips 
                isMobile={isMobile}
                />
            </Box>
        </Container>
    )
}