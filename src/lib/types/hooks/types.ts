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
import { UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
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
  handleTitle: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  handleDescription: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  handleLocation: (input: string) => void;
  schedule: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmittable: boolean;
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
