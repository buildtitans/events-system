"use client"
import Box from '@mui/material/Box';
import type { JSX } from 'react';
import { LandingHeader } from '../typography/landingHeader';
import { MobileEventsSearch } from '../nav/landingSubNav';
import { ActiveCategory } from '@/src/features/events/activeCategory';
import { useMainContentPipelines } from '@/src/lib/hooks/useMainContentPipelines';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { PaginateEvents } from '../box/pagination/paginateEvents';
import { usePopulateGroups } from '@/src/lib/hooks/usePopulateGroups';
import { loadGroupsPipeline } from '../../pipelines/groups/loadGroupsPipeline';
import { useGetCategories } from '@/src/lib/hooks/useGetCategories';

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
  const tab = useSelector((s: RootState) => s.rendering.mainContent);
  const content = useMainContentPipelines(tab);
  const groupsLoadingStatus = usePopulateGroups();
  useGetCategories();

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
        <PaginateEvents />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {content}

        {loadGroupsPipeline(groupsLoadingStatus)}
      </Box>



    </Box>
  );
}

export default MainContent;