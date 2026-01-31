type MountStatus = "active" | "idle";

type LoadingStatus = "idle" | "pending" | "failed";

type RequestStatus = "idle" | "success" | "pending" | "failed";

type SnackbarMessages = {
    logout: Record<RequestStatus, string>;
    login: Record<RequestStatus, string>;
    newGroup: Record<RequestStatus, string>;
    newEvent: Record<RequestStatus, string>;
};


type UserInGroupRoleType =
    'anonymous'
    | 'member'
    | 'organizer';


type AlertKind = "success" | "error"

type AlertMessages = {
    createGroup: Record<AlertKind, string>,
    signup: Record<AlertKind, string>,
    createEvent: Record<AlertKind, string>
}

type AlertMessagesType =
    | { action: null, kind: null, message: null }
    | {
        [A in keyof AlertMessages]:
        {
            [K in keyof AlertMessages[A]]: { action: A, kind: K, message: AlertMessages[A][K] }

        }[keyof AlertMessages[A]]
    }[keyof AlertMessages];


export type {
    MountStatus,
    LoadingStatus,
    RequestStatus,
    SnackbarMessages,
    UserInGroupRoleType,
    AlertKind,
    AlertMessages,
    AlertMessagesType
}