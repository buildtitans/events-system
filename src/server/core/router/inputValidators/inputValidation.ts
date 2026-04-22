import {
  typeboxInput,
  typeboxInputV2,
} from "@/src/server/core/router/adaptors/typeBoxValidation";
import { NewEventInputSchemaValidator } from "@/src/schemas/events/eventSchema";
import type { NewEventInputSchemaType } from "@/src/schemas/events/eventSchema";
import {
  AttendanceUpdateInputSchemaType,
  AttendanceUpdateInputSchemaValidator,
  CompiledEventIdSchema,
  CompiledEventIdsSchema,
  EventIdSchemaType,
  UpdatedAttendanceResponseSchema,
  type EventIdsSchemaType,
} from "@/src/schemas/events/eventAttendantsSchema";
import {
  CompiledMemberToRemoveSchema,
  GroupIDForInsertSchemaType,
  GroupIDForInsertSchemaValidator,
  MemberToRemoveSchemaType,
} from "@/src/schemas/groups/groupMembersSchema";
import {
  CompiledSearchSchema,
  SearchSchemaType,
} from "@/src/schemas/search/searchSchema";
import {
  CompiledNewGroupInputSchema,
  GroupSlugSchemaType,
  CompiledGroupSlugSchema,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import {
  CompiledCreateNotificationSchema,
  CompiledNotificationSchemaArray,
  CompiledViewedNotificationsIdsSchema,
  CreateNotificationSchemaType,
  NotificationSchemaArrayType,
  ViewedNotificationsIdsSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";
import {
  CompiledEmailSchema,
  CompiledTokenAndPasswordSchema,
  EmailSchemaType,
  TokenAndPasswordSchemaType,
} from "@/src/schemas/auth/loginCredentialsSchema";

export const NewEventInputValidator = typeboxInput<NewEventInputSchemaType>(
  NewEventInputSchemaValidator,
);

export const EventIdInputValidator = typeboxInput<EventIdsSchemaType>(
  CompiledEventIdsSchema,
);

export const UpdateAttendanceInputValidator =
  typeboxInput<AttendanceUpdateInputSchemaType>(
    AttendanceUpdateInputSchemaValidator,
  );

export const EventIDValidator = typeboxInput<EventIdSchemaType>(
  CompiledEventIdSchema,
);

export const UpdatedAttendanceResponseValidator = typeboxInputV2(
  UpdatedAttendanceResponseSchema,
);

export const MemberToRemoveInputValidator =
  typeboxInput<MemberToRemoveSchemaType>(CompiledMemberToRemoveSchema);

export const groupIdInputValidator = typeboxInput<GroupIDForInsertSchemaType>(
  GroupIDForInsertSchemaValidator,
);

export const searchInputValidator =
  typeboxInput<SearchSchemaType>(CompiledSearchSchema);

export const newGroupInputValidator = typeboxInput<NewGroupInputSchemaType>(
  CompiledNewGroupInputSchema,
);

export const groupSlugInputValidator = typeboxInput<GroupSlugSchemaType>(
  CompiledGroupSlugSchema,
);

export const createNotificationInput =
  typeboxInput<CreateNotificationSchemaType>(CompiledCreateNotificationSchema);

export const SeenNotificationsInputValidator =
  typeboxInput<ViewedNotificationsIdsSchemaType>(
    CompiledViewedNotificationsIdsSchema,
  );

export const NotificationArrayInputValidator =
  typeboxInput<NotificationSchemaArrayType>(CompiledNotificationSchemaArray);

export const UserEmailInputValidator =
  typeboxInput<EmailSchemaType>(CompiledEmailSchema);

export const TokenAndPasswordValidator =
  typeboxInput<TokenAndPasswordSchemaType>(CompiledTokenAndPasswordSchema);
