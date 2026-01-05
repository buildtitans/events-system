"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { checkFastifyHealth } from '@/src/lib/services/checkFastifyHealth';
import type { JSX } from 'react';
import { LandingHeader } from '../../ui/typography/landingHeader';
import { MobileEventsSearch } from '../nav/landingSubNav';
import { ActiveCategory } from '@/src/features/events/activeCategory';
import { usePopulateEventsList } from '@/src/lib/hooks/usePopulateEventLIst';
import { loadEventsPipeline } from '../../pipelines/events/loadEventsPipeline';


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
  const { eventLoadingStatus } = usePopulateEventsList();

  console.log(eventLoadingStatus)

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

      {loadEventsPipeline(eventLoadingStatus)}

    </Box>
  );
}

export default MainContent;