"use client"
import Box from '@mui/material/Box';
import { type JSX } from 'react';
import { ActiveCategory } from '@/src/features/events/activeCategory';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { loadGroupsPipeline } from '../pipelines/groups/loadGroupsPipeline';
import { MobileEventsSearch } from '../ui/nav/landingSubNav';
import { LandingHeader } from '../ui/typography/landingHeader';
import { overrides } from '@/src/styles/sx/sx';
import { loadEventsPipeline } from '../pipelines/events/loadEventsPipeline';

function HomePage(): JSX.Element {
  const events = useSelector((s: RootState) => s.events.eventPages);
  const initialLoadStatus = useSelector((s: RootState) => s.rendering.initialLoadStatus);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}
    >
      <LandingHeader />
      <MobileEventsSearch />
      <Box
        sx={overrides}
      >
        <ActiveCategory />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: 'start',
          justifyContent: 'center'
        }}
      >
        {loadEventsPipeline(initialLoadStatus, events)}

        {loadGroupsPipeline(initialLoadStatus)}
      </Box>



    </Box>
  );
}

export default HomePage;