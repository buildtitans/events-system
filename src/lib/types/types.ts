import type { NextResponse } from "next/server";

type HealthCheck = { ok: boolean };

type HealthCheckResponse = Promise<NextResponse<HealthCheck>>;

type MountStatus = 'active' | 'idle';

type EventLoadingStatus = 'idle' | 'pending' | 'failed';

type UsePopulateEventsListHook = {
    eventLoadingStatus: EventLoadingStatus
}

export type { EventLoadingStatus, UsePopulateEventsListHook, HealthCheck, HealthCheckResponse, MountStatus }