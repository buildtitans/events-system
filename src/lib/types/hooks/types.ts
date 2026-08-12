import type { Dayjs } from "dayjs";
import type { PickerChangeHandlerContext } from "@mui/x-date-pickers";
import type { DateTimeValidationError } from "@mui/x-date-pickers";
import { OrganizerAndUserIdsType } from "@/src/lib/utils/parsing/getIdsBySlug";
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
import type { SyntheticEvent, ChangeEvent, RefObject } from "react";
import type {
  AutocompleteInputChangeReason,
  AutocompleteChangeReason,
} from "@mui/material/useAutocomplete";
import type {
  AutoCompleteSearch,
  SuggestionType,
} from "../../hooks/search/types";
import { InputErrorsType } from "@/src/lib/hooks/auth/credentials/useValidateSignupCredentials";
import { LoginCredentials } from "../tokens/types";
import { AuthenticationState } from "../../store/slices/auth/types";

export type RBACType = Record<
  GroupMemberSchemaType["group_id"],
  GroupMemberSchemaType["role"]
>;

export type ValidateSignupCredsHook = {
  handleEmailInput: (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => Promise<void>;
  handlePasswordInput: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => Promise<void>;
  handleConfirmingPassword: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => Promise<void>;
  password: string;
  email: string;
  messages: { authState: AuthenticationState; inputErrors: InputErrorsType };
  isValidated: boolean;
  emailRef: RefObject<HTMLInputElement | null>;
  passwordRef: RefObject<HTMLInputElement | null>;
};

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

type AppSearchSearchHook = {
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
  suggestions: AutoCompleteSearch;
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

export type CredentialsInputErrors = {
  emailErrorMessage: string;
  emailError: boolean;
  passwordError: boolean;
  passwordErrorMessage: string;
};

type CredentialsValidationErrors = {
  authState: AuthenticationState;
  inputErrors: CredentialsInputErrors;
};

type ValidateCredentialsHook = {
  isSubmittable: boolean;
  errors: CredentialsValidationErrors;
  handleEmail: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handlePassword: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

type GetGroupRoleAndIdHook = {
  groupID: OrganizerAndUserIdsType["groupId"];
  roleType: GroupMemberSchemaType["role"];
  groupName: GroupSchemaType["name"];
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

type RemoveUserFromGroupHook = {
  removeUserFromGroup: (
    group_id: GroupMemberSchemaType["user_id"],
  ) => Promise<void>;
};

export type {
  GetGroupRoleAndIdHook,
  CreateEventHook,
  UseLoginHook,
  GetGroupMembersHook,
  JoinGroupHook,
  UpdateAttendanceStatusHook,
  ValidateCredentialsHook,
  CancelEventHook,
  ChangeActiveCategoryHook,
  AppSearchSearchHook,
  RemoveUserFromGroupHook,
  NewUser,
};
