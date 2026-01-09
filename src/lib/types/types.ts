import type { NextResponse } from "next/server";

type HealthCheck = { ok: boolean };

type HealthCheckResponse = Promise<NextResponse<HealthCheck>>;

type MountStatus = 'active' | 'idle';

type LoadingStatus = 'idle' | 'pending' | 'failed';

type UsePopulateEventsListHook = {
    eventLoadingStatus: LoadingStatus
}

export type { LoadingStatus, UsePopulateEventsListHook, HealthCheck, HealthCheckResponse, MountStatus }