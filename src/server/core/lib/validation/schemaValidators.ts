import "@/src/schemas/format";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { TSchema } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";
import type { ValueError } from "@sinclair/typebox/compiler";
import {
  EventsArraySchema,
  EventsByGroupIdSchema,
  EventSchema,
  NewEventInputSchema,
} from "@/src/schemas/events/eventSchema";
import { PaginatedLayoutSchema } from "@/src/schemas/events/layoutSlotSchema";
import { GroupSchema, GroupsSchema } from "@/src/schemas/groups/groupSchema";
import { GroupIdSchema } from "@/src/schemas/events/eventSchema";
import { EventSearchSchema } from "@/src/schemas/events/eventSchema";
import {
  EventAttendantsSchema,
  EventAttendantStatusSchema,
  EventIdsSchema,
} from "@/src/schemas/events/eventAttendantsSchema";
import {
  UserMembershipSchema,
  UserMembershipSchemaArray,
} from "@/src/schemas/groups/userMembershipSchema";
import {
  NotificationSchema,
  NotificationSchemaArray,
} from "@/src/schemas/notifications/notificationsSchema";
import { LoginCredentialsSchema } from "@/src/schemas/auth/loginCredentialsSchema";
import { RsvpSchema, RsvpSchemaArray } from "@/src/schemas/events/rsvpSchema";
import {
  GroupMembersArraySchema,
  GroupMemberSchema,
  GroupRoleSchema,
  MemberCountSchema,
} from "@/src/schemas/groups/groupMembersSchema";

function preview(value: unknown, max = 160) {
  if (value == null) return String(value);
  try {
    const s = typeof value === "string" ? value : JSON.stringify(value);
    return s.length > max ? s.slice(0, max) + "…(truncated)" : s;
  } catch {
    return "[unserializable]";
  }
}

function formatErrors(errors: ValueError[]) {
  return errors
    .map((e, i) => {
      const path = e.path || "(root)";
      return [
        `#${i + 1} ${path}`,
        `  message: ${e.message}`,
        `  value:   ${preview(e.value)}`,
      ].join("\n");
    })
    .join("\n");
}

export function createValidator<T extends TSchema>(
  schema: T,
  schemaName = "Schema",
) {
  const compiled = TypeCompiler.Compile(schema);

  return (data: unknown): Static<T> => {
    if (!compiled.Check(data)) {
      const errs = [...compiled.Errors(data)];

      console.error(
        `\n❌ ${schemaName} validation failed (${errs.length} errors)\n${formatErrors(errs)}\n`,
      );

      throw new Error(
        `${schemaName} validation failed (${errs.length} errors). See console for details.`,
      );
    }

    return data as Static<T>;
  };
}

const ValidateEventSearchQuery = createValidator(
  EventSearchSchema,
  "EventSearchSchema",
);

const eventValidator = createValidator(EventSchema, "EventSchema");

const eventsValidator = createValidator(EventsArraySchema, "EventsArraySchema");

const layoutSlotValidator = createValidator(
  PaginatedLayoutSchema,
  "PaginatedLayoutSchema",
);

export const EventsByGroupIdSchemaValidator = createValidator(
  EventsByGroupIdSchema,
  "EventsByGroupIdSchema",
);
const GroupSchemaValidator = createValidator(GroupSchema, "GroupsSchema");

const GroupsSchemaValidator = createValidator(GroupsSchema, "GroupsSchema");

const NewEventSchemaValidator = createValidator(
  NewEventInputSchema,
  "NewEventInputSchema",
);

const ValidateGroupId = createValidator(GroupIdSchema, "GroupIdSchema");

const CompiledGroupIdsSchema = TypeCompiler.Compile(EventIdsSchema);

export const UserMembershipSchemaArrayValidator = createValidator(
  UserMembershipSchemaArray,
  "UserMembershipSchemaArray",
);

export const UserMembershipSchemaValidator = createValidator(
  UserMembershipSchema,
  "UserMembershipSchema",
);

export const NotificationSchemaValidator = createValidator(
  NotificationSchema,
  "NotificationsSchema",
);

export const NotificationSchemaArrayValidator = createValidator(
  NotificationSchemaArray,
  "NotificationSchemaArray",
);

export const validateLoginInput = createValidator(
  LoginCredentialsSchema,
  "LoginCredentialsSchema",
);

export const ValidateRawAttendants = createValidator(
  EventAttendantsSchema,
  "EventAttendantsSchema",
);

export const RsvpStatusSchemaValidator = createValidator(
  EventAttendantStatusSchema,
  "EventAttendantStatusSchema",
);

export const RsvpSchemaValidator = createValidator(RsvpSchema, "RsvpSchema");

export const RsvpSchemaArrayValidator = createValidator(
  RsvpSchemaArray,
  "RsvpSchemaArray",
);

export const ValidateGroupMember = createValidator(
  GroupMemberSchema,
  "GroupMemberSchema",
);

export const MemberCountSchemaValidator = createValidator(
  MemberCountSchema,
  "MemberCountSchema",
);

export const GroupRoleSchemaValidator = createValidator(
  GroupRoleSchema,
  "GroupRoleSchema",
);

export const ValidateGroupMembersArray = createValidator(
  GroupMembersArraySchema,
  "GroupMembersArraySchema",
);

export {
  CompiledGroupIdsSchema,
  eventsValidator,
  layoutSlotValidator,
  GroupSchemaValidator,
  GroupsSchemaValidator,
  NewEventSchemaValidator,
  eventValidator,
  ValidateEventSearchQuery,
  ValidateGroupId,
};
