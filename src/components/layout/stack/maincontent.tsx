"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { checkFastifyHealth } from '@/src/lib/services/checkFastifyHealth';
import type { JSX } from 'react';
import { LandingHeader } from '../../ui/typography/landingHeader';
import { MobileEventsSearch } from '../nav/landingSubNav';
import { EventsSearch } from '@/src/features/eventsSearch';
import { EventCategories } from '@/src/features/eventCategories';
import EventCards from './eventCards';

function MainContent(): JSX.Element {

  const handleClick = () => {
    console.info('You clicked the filter chip.');
  };

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
        sx={{
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
        }}
      >
        <EventCategories handleClick={handleClick} />
        <EventsSearch />
      </Box>

      <EventCards
      />
    </Box>
  );
}

export default MainContent;