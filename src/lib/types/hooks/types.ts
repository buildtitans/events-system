import type { Dayjs } from "dayjs";
import type { PickerChangeHandlerContext } from "@mui/x-date-pickers";
import type { DateTimeValidationError } from "@mui/x-date-pickers";
import type {
  UserInGroupRoleType,
  LoadingStatus,
  DomainStatus,
} from "@/src/lib/types/tokens/types";
import { OrganizerAndUserIdsType } from "@/src/lib/utils/parsing/getIdsBySlug";
import type {
  EventsStateType,
  EventsPages,
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
import React, { type SetStateAction } from "react";
import type { SyntheticEvent, ChangeEvent } from "react";
import type {
  AutocompleteInputChangeReason,
  AutocompleteChangeReason,
} from "@mui/material/useAutocomplete";
import type {
  AddressSearchState,
  AddressSuggestion,
  AddressSuggestionsState,
  AutoCompleteOptions,
  SuggestionOptions,
  SuggestionType,
} from "../../hooks/search/types";
import { InputErrorsType } from "../../hooks/auth/useValidateSignupCredentials";

type RBACType = Record<
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
  errors: InputErrorsType;
  isValidated: boolean;
};

export type NewEventType = {
  title: EventSchemaType["title"];
  description: EventSchemaType["description"];
  starts_at: string;
  group_id: EventSchemaType["group_id"];
  img: EventSchemaType["img"] | null;
  meeting_location: EventSchemaType["meeting_location"];
  tag: EventSchemaType["tag"];
};

export type FilterType = EventDisplayFilter | "initial";

export type AttendanceDictionaryType = Record<
  EventAttendantsSchemaType["event_id"],
  EventAttendantsSchemaType["status"]
>;

type DebouncedSearchHook = {
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
  suggestions: SuggestionOptions;
  status: AutoCompleteOptions["status"];
  message: AutoCompleteOptions["message"];
  error: AutoCompleteOptions["error"];
};

type ChangeActiveCategoryHook = {
  setFilter: React.Dispatch<SetStateAction<FilterType>>;
  eventStatus: EventsStateType["status"];
  mountStatus: DomainStatus;
  pendingFilter: boolean;
};

type CreateEventHook = {
  handleStartsAt: (
    value: Dayjs | null,
    context: PickerChangeHandlerContext<DateTimeValidationError>,
  ) => void;
  handleLocation: (input: string) => void;
  schedule: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmittable: boolean;
  getInput: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    field: keyof NewEventType,
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

type ValidateCredentialsHook = {
  isSubmittable: boolean;
  emailErrorMessage: string;
  emailError: boolean;
  passwordError: boolean;
  passwordErrorMessage: string;
  handleEmail: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handlePassword: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
};

type GetGroupRoleAndIdHook = {
  groupID: OrganizerAndUserIdsType["groupId"];
  roleType: UserInGroupRoleType;
  groupName: GroupSchemaType["name"];
};

type LoginResType =
  | {
      status: "ok";
      email: string;
      lookupMap: RBACType;
      attendanceDictionary: AttendanceDictionaryType;
    }
  | {
      status: "failed";
      email: undefined;
      lookupMap: undefined;
      attendanceDictionary: undefined;
    };

type UseLoginHook = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  status: LoginResType["status"] | "initial";
};

type UsePopulateEventsListHook = {
  eventLoadingStatus: LoadingStatus;
};

type GetGroupEventsHook = {
  groupEvents: EventsPages;
  status: LoadingStatus;
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
  UsePopulateEventsListHook,
  GetGroupEventsHook,
  GetGroupMembersHook,
  JoinGroupHook,
  UpdateAttendanceStatusHook,
  ValidateCredentialsHook,
  CancelEventHook,
  ChangeActiveCategoryHook,
  DebouncedSearchHook,
  RemoveUserFromGroupHook,
};
