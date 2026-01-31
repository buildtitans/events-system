import type { Dayjs } from "dayjs";
import type { PickerChangeHandlerContext } from "@mui/x-date-pickers";
import type { DateTimeValidationError } from "@mui/x-date-pickers";
import type { UserInGroupRoleType, LoadingStatus } from "@/src/lib/types/tokens/types";
import { OrganizerAndUserIdsType } from "@/src/lib/utils/parsing/getIdsBySlug";

type CreateEventHook = {
    handleStartsAt: (value: Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => void,
    handleTitle: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    handleDescription: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    handleLocation: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    schedule: (e: React.FormEvent<HTMLFormElement>) => void,
}

type GetGroupRoleAndIdHook = {
    groupID: OrganizerAndUserIdsType["groupId"],
    roleType: UserInGroupRoleType
}

type UseLoginHook = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};


type UsePopulateEventsListHook = {
    eventLoadingStatus: LoadingStatus;
};


export type {
    GetGroupRoleAndIdHook,
    CreateEventHook,
    UseLoginHook,
    UsePopulateEventsListHook
}