import type {
  AlertMessagesType,
  RequestStatus,
  SnackbarMessages,
} from "@/src/lib/types/tokens/types";

export type MainContentTabType =
  | "Upcoming Events"
  | "Local Events"
  | "Categories"
  | "Popular Events";

export type ActiveModal =
  | "confirm cancel"
  | "confirm signout"
  | "confirm leave group"
  | null;

export type ActiveDrawer =
  | "create event drawer"
  | "sign in drawer"
  | "event drawer"
  | "new group"
  | "sign up drawer"
  | null;

export type ActiveSidebar = "group" | "user" | null;

export type AlertType = {
  action: AlertMessagesType["action"];
  kind: AlertMessagesType["kind"];
};

export type SnackbarStatusAndKind = {
  kind: keyof SnackbarMessages | null;
  status: RequestStatus;
};
