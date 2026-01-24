import type { NextResponse } from "next/server";
import type { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";

type HealthCheck = { ok: boolean };

type HealthCheckResponse = Promise<NextResponse<HealthCheck>>;

type MountStatus = "active" | "idle";

type LoadingStatus = "idle" | "pending" | "failed";

type RequestStatus = "idle" | "success" | "pending" | "failed";



type UsePopulateEventsListHook = {
    eventLoadingStatus: LoadingStatus;
};

type SnackbarMessages = {
    logout: Record<RequestStatus, string>;
    login: Record<RequestStatus, string>;
    newGroup: Record<RequestStatus, string>;
    newEvent: Record<RequestStatus, string>;
};

type AlertKind = "success" | "error"

type AlertMessages = {
    createGroup: Record<AlertKind, string>,
    signup: Record<AlertKind, string>
}

type AlertMessagesType =
    | { action: null, kind: null, message: null }
    | {
        [A in keyof AlertMessages]:
        {
            [K in keyof AlertMessages[A]]: { action: A, kind: K, message: AlertMessages[A][K] }

        }[keyof AlertMessages[A]]
    }[keyof AlertMessages];

type UseLoginHook = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

type EventsPages = Array<LayoutSlotSchemaType[]>;

export type {
    AlertMessagesType,
    LoadingStatus,
    UsePopulateEventsListHook,
    HealthCheck,
    HealthCheckResponse,
    MountStatus,
    EventsPages,
    UseLoginHook,
    RequestStatus,
    SnackbarMessages,
    AlertMessages
};
