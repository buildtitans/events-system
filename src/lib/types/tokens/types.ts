type MountStatus =
    "active"
    | "idle";

type LoadingStatus =
    "idle"
    | "pending"
    | "failed"
    | "warning";

type DomainStatus = LoadingStatus | 'initial';

type RequestStatus =
    "idle"
    | "success"
    | "pending"
    | "failed";

type SnackbarMessages = {
    logout: Record<RequestStatus, string>;
    login: Record<RequestStatus, string>;
    newGroup: Record<RequestStatus, string>;
    newEvent: Record<RequestStatus, string>;
    joiningGroup: Record<RequestStatus, string>,
    updatingAttendance: Record<RequestStatus, string>,
    changeEventScheduling: Record<RequestStatus, string>
};


type UserInGroupRoleType =
    'anonymous'
    | 'member'
    | 'organizer';

type LoginCredentials = {
    email: string | null,
    password: string | null
};

type ValidationState = {
    hasError: boolean,
    message: string
}

type AlertKind =
    "success"
    | "error";


type AlertMessages = {
    createGroup: Record<AlertKind, string>,
    signup: Record<AlertKind, string>,
    createEvent: Record<AlertKind, string>,
    updateAttendance: Record<AlertKind, string>
}

type AlertMessagesType =
    | { action: null, kind: null, message: null }
    | {
        [A in keyof AlertMessages]:
        {
            [K in keyof AlertMessages[A]]: { action: A, kind: K, message: AlertMessages[A][K] }
        }[keyof AlertMessages[A]]
    }[keyof AlertMessages];

// —> without this indexed access([keyof AlertMessages] seen on line 52 above), 
// we still have an *object*, who'se *values* are unions
//  i.e. it looks like the example below: 
//     {
//       createGroup:   (union of createGroup alerts)
//       signup:        (union of signup alerts)
//       createEvent:   (union of createEvent alerts)
//     }
// We want *one* union, not a keyed object.
// `keyof AlertMessages` gives the key union ("createGroup" | "signup" | "createEvent").
// Indexing with that union extracts values and unions them:
//  T[K1 | K2 | K3] => T[K1] | T[K2] | T[K3]


export type {
    MountStatus,
    LoadingStatus,
    RequestStatus,
    SnackbarMessages,
    UserInGroupRoleType,
    AlertKind,
    AlertMessages,
    AlertMessagesType,
    LoginCredentials,
    ValidationState,
    DomainStatus
}