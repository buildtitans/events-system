import type { NextResponse } from "next/server";
import type { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
import type { SetStateAction } from "react";

type HealthCheck = { ok: boolean };

type HealthCheckResponse = Promise<NextResponse<HealthCheck>>;

type MountStatus = 'active' | 'idle';

type LoadingStatus = 'idle' | 'pending' | 'failed';

type LoginStatus = 'idle' | 'success' | 'pending' | 'failed';

type RequestStatus = 'idle' | 'success' | 'pending' | 'failed';

type UsePopulateEventsListHook = {
    eventLoadingStatus: LoadingStatus
}

type SnackbarMessages = {
    logout: Record<RequestStatus, string>;
    login: Record<RequestStatus, string>;
    // register?: ...
};


type createSnackbarMessageTypes = {
    logout: Record<RequestStatus, string>,
    login: Record<RequestStatus, string>
}

type UseLoginHook = {
    loginStatus: RequestStatus,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
}

type EventsPages = Array<LayoutSlotSchemaType[]>


export type { LoadingStatus, UsePopulateEventsListHook, HealthCheck, HealthCheckResponse, MountStatus, EventsPages, UseLoginHook, RequestStatus, SnackbarMessages }