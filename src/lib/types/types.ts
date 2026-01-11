import type { NextResponse } from "next/server";
import type { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";

type HealthCheck = { ok: boolean };

type HealthCheckResponse = Promise<NextResponse<HealthCheck>>;

type MountStatus = 'active' | 'idle';

type LoadingStatus = 'idle' | 'pending' | 'failed';

type UsePopulateEventsListHook = {
    eventLoadingStatus: LoadingStatus
}

type EventsPages = Array<LayoutSlotSchemaType[]>


export type { LoadingStatus, UsePopulateEventsListHook, HealthCheck, HealthCheckResponse, MountStatus, EventsPages }