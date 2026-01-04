"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { checkFastifyHealth } from '@/src/lib/services/checkFastifyHealth';
import type { JSX } from 'react';
import { LandingHeader } from '../../ui/typography/landingHeader';
import { MobileEventsSearch } from '../nav/landingSubNav';
import EventCards from './eventCards';
import { ActiveCategory } from '@/src/features/events/activeCategory';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';

const overrides = {
  display: 'flex',
  flexDirection: {
    xs: 'column-reverse',
    md: 'row'
  },
  width: '100%',
  justifyContent: 'space-between',
  alignItems: {
    xs: 'start',
    md: 'center'
  },
  gap: 4,
  overflow: 'auto',
};

function MainContent(): JSX.Element {
  const displayedCategory = useSelector((s: RootState) => s.categories.displayed);

  React.useEffect(() => {
    const executeHealthCheck = async () => {
      const health = await checkFastifyHealth();
      console.log(health.ok);
    }

    executeHealthCheck();
  }, []);


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

      <EventCards
        key={displayedCategory}
      />
    </Box>
  );
}

export default MainContent;