import type { RefObject, SetStateAction } from "react";

type PromiseAllSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

type MountStatus = "active" | "idle";

type RequestStatus = "idle" | "success" | "pending" | "failed";

type SnackbarMessages = {
  logout: Record<RequestStatus, string>;
  login: Record<RequestStatus, string>;
  newGroup: Record<RequestStatus, string>;
  newEvent: Record<RequestStatus, string>;
  joiningGroup: Record<RequestStatus, string>;
  updatingAttendance: Record<RequestStatus, string>;
  changeEventScheduling: Record<RequestStatus, string>;
  signup: Record<RequestStatus, string>;
  leaveGroup: Record<RequestStatus, string>;
  pwResetEmail: Record<RequestStatus, string>;
};

export type HTMLInputField = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;
export interface ValidateCredentialsHookArgs {
  credentials: LoginCredentials;
  setCredentials: React.Dispatch<SetStateAction<LoginCredentials>>;
  emailRef: RefObject<HTMLInputElement | null>;
  passwordRef: RefObject<HTMLInputElement | null>;
}

type LoginCredentials = {
  email: string;
  password: string;
};

type HasPasswordError =
  | "Invalid password or email"
  | "Password needs to be at least 6 characters";

type HasEmailError = "Please provide a valid email";

type CredentialsInputError = HasEmailError | HasPasswordError | "";

type ValidationState = {
  hasError: boolean;
  message: CredentialsInputError;
};

type AlertKind = "success" | "error";

type AlertMessages = {
  createGroup: Record<AlertKind, string>;
  signup: Record<AlertKind, string>;
  createEvent: Record<AlertKind, string>;
  updateAttendance: Record<AlertKind, string>;
  resetLinkSent: Record<AlertKind, string>;
  passwordReset: Record<AlertKind, string>;
  invalidEmail: Record<AlertKind, string>;
  leaveGroup: Record<AlertKind, string>;
};

type AlertMessagesType =
  | { action: null; kind: null; message: null }
  | {
      [A in keyof AlertMessages]: {
        [K in keyof AlertMessages[A]]: {
          action: A;
          kind: K;
          message: AlertMessages[A][K];
        };
      }[keyof AlertMessages[A]];
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
  RequestStatus,
  SnackbarMessages,
  AlertKind,
  AlertMessages,
  AlertMessagesType,
  LoginCredentials,
  ValidationState,
  PromiseAllSettledResult,
};
