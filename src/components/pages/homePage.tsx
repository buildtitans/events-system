"use client"
import Box from '@mui/material/Box';
import type { JSX } from 'react';
import HomeContent from '@/src/components/sections/home/homeContent';
import HomeHeadSection from '../sections/headers/homeHeadSection';
import Stack from '@mui/material/Stack';

function HomePage(): JSX.Element {

  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: '100svh'
      }}
    >
      <HomeHeadSection />
      <HomeContent />
    </Stack>
  );
}

export default HomePage;