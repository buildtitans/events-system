import type { Dayjs } from "dayjs";
import type { PickerChangeHandlerContext } from "@mui/x-date-pickers";
import type { DateTimeValidationError } from "@mui/x-date-pickers";
import type {
  EventsStateType,
  EventDisplayFilter,
} from "../../store/slices/events/types";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import {
  EventAttendantsSchemaType,
  EventAttendantStatusSchemaType,
} from "@/src/schemas/events/eventAttendantsSchema";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  EventSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import React from "react";
import type { SyntheticEvent } from "react";
import type {
  AutocompleteInputChangeReason,
  AutocompleteChangeReason,
} from "@mui/material/useAutocomplete";
import type {
  AutoCompleteSearch,
  SearchResultState,
  SuggestionType,
} from "../../hooks/search/types";
import { LoginCredentials } from "../tokens/types";

export type NewEventInput = {
  title: EventSchemaType["title"];
  description: EventSchemaType["description"];
  starts_at: string;
  group_id: EventSchemaType["group_id"] | null;
  img: EventSchemaType["img"] | null;
  meeting_location: EventSchemaType["meeting_location"];
  tag: EventSchemaType["tag"];
};

export type FilterType = EventDisplayFilter | "initial";

export type AttendanceDictionaryType = Record<
  EventAttendantsSchemaType["event_id"],
  EventAttendantsSchemaType["status"]
>;

type AppSearchSuggestionsHook = {
  input: string;
  onInputChange: (
    _event: SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void;
  selectOption: (
    event: React.SyntheticEvent,
    value: SuggestionType | null,
    reason: AutocompleteChangeReason,
  ) => void;
};

type ChangeActiveCategoryHook = {
  filterFor: (filter: EventDisplayFilter) => Promise<void>;
  eventStatus: EventsStateType["status"];
  pendingFilter: boolean;
};

type CreateEventHook = {
  handleStartsAt: (
    value: Dayjs | null,
    context: PickerChangeHandlerContext<DateTimeValidationError>,
  ) => void;
  handleLocation: (input: string) => void;
  schedule: (e: React.FormEvent<HTMLFormElement>) => void;
  isDisabled: boolean;
  getInput: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: keyof NewEventInput,
  ) => void;
};

export type NewGroupInputType = {
  name: GroupSchemaType["name"];
  description: GroupSchemaType["description"];
  location: GroupSchemaType["location"];
  category_id: GroupSchemaType["category_id"];
};

export type CreateNewGroupHook = {
  newGroup: NewGroupInputType;
  handleGroupCategory: (category_id: string | null) => void;
  submitNewGroup: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  isSubmittable: boolean;
  handleLocation: (input: string) => void;
  getInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof NewGroupInputType,
  ) => void;
};

export type LoginResType =
  | {
      status: "ok";
      email: string;
      attendanceDictionary: AttendanceDictionaryType;
    }
  | {
      status: "failed";
      email: undefined;
      attendanceDictionary: undefined;
    };

type UseLoginHook = {
  login: (credentials: LoginCredentials) => Promise<void>;
};

type NewUser = {
  id: string;
  email: string;
};

type GetGroupMembersHook = {
  members: GroupMemberSchemaType[];
};

type JoinGroupHook = {
  handleClick: (group_id: GroupSchemaType["id"]) => Promise<void>;
};

type UpdateAttendanceStatusHook = {
  newStatus: EventAttendantStatusSchemaType;
  handleStatusChange: (e: SelectChangeEvent) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

type CancelEventHook = {
  options: UpdateEventArgsSchemaType;
  handleStatusChange: () => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
};

type LeaveGroupHook = {
  removeUserFromGroup: (
    group_id: GroupMemberSchemaType["user_id"],
  ) => Promise<void>;
};

export type {
  CreateEventHook,
  UseLoginHook,
  GetGroupMembersHook,
  JoinGroupHook,
  UpdateAttendanceStatusHook,
  CancelEventHook,
  ChangeActiveCategoryHook,
  AppSearchSuggestionsHook,
  LeaveGroupHook,
  NewUser,
};
