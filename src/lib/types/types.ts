import type { NextResponse } from "next/server";
import type { LayoutSlotSchemaType } from "@/src/schemas/layoutSlotSchema";
<<<<<<< HEAD
import type { SetStateAction } from "react";
=======
<<<<<<< Updated upstream
=======
import type { SetStateAction } from "react";
import { SnackbarStatusAndKind } from "../store/slices/RenderingSlice";
>>>>>>> Stashed changes
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)

type HealthCheck = { ok: boolean };

type HealthCheckResponse = Promise<NextResponse<HealthCheck>>;

type MountStatus = 'active' | 'idle';

type LoadingStatus = 'idle' | 'pending' | 'failed';

type LoginStatus = 'idle' | 'success' | 'pending' | 'failed';

type RequestStatus = 'idle' | 'success' | 'pending' | 'failed';

type UsePopulateEventsListHook = {
    eventLoadingStatus: LoadingStatus
}

<<<<<<< HEAD
=======
<<<<<<< Updated upstream
=======
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
type SnackbarMessages = {
    logout: Record<RequestStatus, string>;
    login: Record<RequestStatus, string>;
    newGroup: Record<RequestStatus, string>;
<<<<<<< HEAD
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

=======
};

type UseLoginHook = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
}

>>>>>>> Stashed changes
>>>>>>> 97a54ef (rendering pipeline for snackbars + modals in <TopLayerHost/>)
type EventsPages = Array<LayoutSlotSchemaType[]>


export type { LoadingStatus, UsePopulateEventsListHook, HealthCheck, HealthCheckResponse, MountStatus, EventsPages, UseLoginHook, RequestStatus, SnackbarMessages }