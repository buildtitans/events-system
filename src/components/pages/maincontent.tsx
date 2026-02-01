"use client"
import Box from '@mui/material/Box';
import type { JSX } from 'react';
import { ActiveCategory } from '@/src/features/events/activeCategory';
import { useMainContentPipelines } from '@/src/lib/hooks/rendering/useMainContentPipelines';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import { usePopulateGroups } from '@/src/lib/hooks/init/usePopulateGroups';
import { useGetCategories } from '@/src/lib/hooks/init/useGetCategories';
import { loadGroupsPipeline } from '../pipelines/groups/loadGroupsPipeline';
import { MobileEventsSearch } from '../ui/nav/landingSubNav';
import { LandingHeader } from '../ui/typography/landingHeader';

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
        {content}

        {loadGroupsPipeline(groupsLoadingStatus)}
      </Box>



    </Box>
  );
}

export default MainContent;