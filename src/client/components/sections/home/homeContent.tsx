"use client"
import { type JSX } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '@/src/lib/store';
import LandingPageGroupSection from '../group/containers/landingPageGroupSection';
import { Stack } from '@mui/material';
import { AsyncStateRenderer } from '../../pipelines/async/asyncStateRenderer';
import { PaginateEvents } from '../../ui/box/pagination/paginateEvents';
import AsyncFailedFallback from '../../ui/feedback/failure/asyncFailedFallback';
import EventsLayout from '../events/eventsLayout';

export default function HomeContent({ isMobile }: {isMobile: boolean}): JSX.Element {
    const {eventPages,currentPage  } = useSelector((s: RootState) => s.events, shallowEqual);

    return (
        <Stack
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                alignItems: 'start',
                justifyContent: 'center',
            }}
        >
            <Stack
            minHeight={800}
            width={"100%"}
            alignItems={"start"}
            justifyContent={"start"}
            direction={"row"}
            >
            <AsyncStateRenderer state={eventPages} empty={() => (<AsyncFailedFallback />) }>
            {(state) => (
              <EventsLayout eventsPages={state} currentPage={currentPage}/>  
            )}
            </AsyncStateRenderer>
            </Stack>

            {isMobile && <AsyncStateRenderer state={eventPages} pending={() => null}>
                {() => <PaginateEvents />}
                </AsyncStateRenderer>}

            <LandingPageGroupSection />

        </Stack>

    )
}