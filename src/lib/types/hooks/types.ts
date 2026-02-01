import type { Dayjs } from "dayjs";
import type { PickerChangeHandlerContext } from "@mui/x-date-pickers";
import type { DateTimeValidationError } from "@mui/x-date-pickers";
import type { UserInGroupRoleType, LoadingStatus, RequestStatus } from "@/src/lib/types/tokens/types";
import { OrganizerAndUserIdsType } from "@/src/lib/utils/parsing/getIdsBySlug";
import { LayoutSlotSchemaArrayType } from "@/src/schemas/layoutSlotSchema";
import { EventsPages } from "../../store/slices/EventsSlice";
import { GroupMembersSchemaType } from "@/src/schemas/groupMembersSchema";
import { GroupSchemaType } from "@/src/schemas/groupSchema";

type CreateEventHook = {
    handleStartsAt: (value: Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => void,
    handleTitle: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    handleDescription: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    handleLocation: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    schedule: (e: React.FormEvent<HTMLFormElement>) => void,
    isSubmittable: boolean
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


type GetGroupEventsHook = {
    groupEvents: EventsPages,
    status: LoadingStatus
};


type GetGroupMembersHook = {
    members: GroupMembersSchemaType[],
}

type JoinGroupHook = {
    handleClick: (group_id: GroupSchemaType["id"]) => Promise<void>,
}

export type {
    GetGroupRoleAndIdHook,
    CreateEventHook,
    UseLoginHook,
    UsePopulateEventsListHook,
    GetGroupEventsHook,
    GetGroupMembersHook,
    JoinGroupHook
}