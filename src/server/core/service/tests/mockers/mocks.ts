import { Authorization } from "@/src/server/core/service/auth/authorization";
import { DBClient } from "../../../db";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import { NotificationSchemaType } from "@/src/schemas/notifications/notificationsSchema";
import { NotificationCreationProcedure } from "../../../db/clients/types/types";
import { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";
import { GroupMemberSchemaType } from "@/src/schemas/groups/groupMembersSchema";
import { UserMembershipSchemaType } from "@/src/schemas/groups/userMembershipSchema";
import { RsvpSchemaType } from "@/src/schemas/events/rsvpSchema";
import {
  USER_ID,
  EVENT_ID,
  GROUP_ID_1,
  GROUP_ID_2,
  GROUP_ID_3,
  EVENT_ID_1,
  EVENT_ID_2,
  EVENT_ID_3,
} from "@/src/server/core/service/tests/mockers/mockValues";

export const groups = [
  makeGroup({ id: GROUP_ID_1, name: "new group 1" }),
  makeGroup({ id: GROUP_ID_2, name: "new group 2" }),
  makeGroup({ id: GROUP_ID_3, name: "new group 3" }),
];

export const events = [
  makeEvent({ id: EVENT_ID_1, group_id: GROUP_ID_1 }),
  makeEvent({ id: EVENT_ID_2, group_id: GROUP_ID_2 }),
  makeEvent({ id: EVENT_ID_3, group_id: GROUP_ID_3 }),
];

export const rsvps = [
  makeRsvp({
    event_id: EVENT_ID_1,
    group_id: GROUP_ID_1,
    attendance_status: "going",
    group_name: "new group 1",
  }),
  makeRsvp({
    event_id: EVENT_ID_2,
    group_id: GROUP_ID_2,
    attendance_status: "interested",
    group_name: "new group 2",
  }),
  makeRsvp({
    event_id: EVENT_ID_3,
    group_id: GROUP_ID_3,
    attendance_status: "going",
    group_name: "new group 3",
  }),
];

export const dtoMemberships: UserMembershipSchemaType[] = [
  makeDtoMembership({
    group_id: GROUP_ID_1,
    group_name: groups[0].name,
    group_description: groups[0].description ?? "",
    location: groups[0].location ?? "",
    group_slug: groups[0].slug,
    member_count: 3,
  }),
  makeDtoMembership({
    group_id: GROUP_ID_2,
    group_name: groups[1].name,
    group_description: groups[1].description ?? "",
    location: groups[1].location ?? "",
    group_slug: groups[1].slug,
    member_count: 5,
  }),
  makeDtoMembership({
    group_id: GROUP_ID_3,
    group_name: groups[2].name,
    group_description: groups[2].description ?? "",
    location: groups[2].location ?? "",
    group_slug: groups[2].slug,
    member_count: 7,
  }),
];

export const policyMock = {
  requireAuthenticated: jest.fn(),
  requireCanManageGroup: jest.fn(),
  requireCanCreateEvent: jest.fn(),
} as unknown as Authorization;

export const authenticateAs = (userId = USER_ID) => {
  (policyMock.requireAuthenticated as jest.Mock).mockReturnValue(userId);
};

export const unauthenticated = () => {
  (policyMock.requireAuthenticated as jest.Mock).mockImplementation(() => {
    throw new Error("401");
  });
};

export const dbMock = {
  events: {
    getEvents: jest.fn(),
    getFlattenedEvents: jest.fn(),
    searchEventByTitle: jest.fn(),
    getGroupEvents: jest.fn(),
    getGroupEventsByGroupId: jest.fn(),
    getEventsByGroupIds: jest.fn(),
    getFlattenedEventsByIds: jest.fn(),
    getEvent: jest.fn(),
    getEventsByIds: jest.fn(),
    updateEventStatus: jest.fn(),
    createNewEvent: jest.fn(),
  },
  groups: {
    getGroups: jest.fn(),
    searchGroups: jest.fn(),
    getGroupsByOrganizerId: jest.fn(),
    getGroupBySlug: jest.fn(),
    createGroup: jest.fn(),
  },
  auth: {
    authenticate: jest.fn(),
    signUp: jest.fn(),
    login: jest.fn(),
    logOut: jest.fn(),
    getEmailByUserId: jest.fn(),
    getSession: jest.fn(),
  },
  categories: {
    getCategories: jest.fn(),
  },
  groupMembers: {
    getViewerMemberships: jest.fn(),
    getMembershipRole: jest.fn(),
    getOrganizer: jest.fn(),
    addOrganizer: jest.fn(),
    addNewMember: jest.fn(),
    removeMember: jest.fn(),
    getGroupMembers: jest.fn(),
    getMemberIds: jest.fn(),
    getMemberCountsByGroupIds: jest.fn(),
  },
  eventAttendants: {
    getUserRsvpStatusToEvent: jest.fn(),
    getAllAttendanceRecords: jest.fn(),
    getAttendants: jest.fn(),
    updateAttendanceStatus: jest.fn(),
    getUserAttendanceRecords: jest.fn(),
    getRawAttendants: jest.fn(),
    getRawAttendant: jest.fn(),
    upsertStatus: jest.fn(),
    parseRawAttendants: jest.fn(),
    parseRawAttendant: jest.fn(),
  },
  notifications: {
    markOpenedNotifications: jest.fn(),
    getUnseenNotifications: jest.fn(),
    addNewNotifications: jest.fn(),
  },
} as unknown as DBClient;

export function makeEvent(
  overrides: Partial<EventSchemaType> = {},
): EventSchemaType {
  return {
    id: "306fbc60-5ac6-4a95-8df9-89a110588000",
    img: "https://picsum.photos/800/450?random=3",
    tag: "Design",
    title: "Design Trends Worth Paying Attention To in 2026",
    description:
      "A conversation for designers and frontend folks about emerging design trends, interface patterns, and how to build experiences that stay relevant over time.",
    starts_at_ms: new Date("2026-04-15T17:30:00.000Z").getTime(),
    starts_at: "2026-04-15T17:30:00.000Z",
    meeting_location: "Online",
    group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    created_at: "2026-04-01T19:57:58.721Z",
    updated_at: "2026-04-01T19:57:58.721Z",
    status: "scheduled",
    ...overrides,
  };
}

export function makeGroup(
  overrides: Partial<GroupSchemaType> = {},
): GroupSchemaType {
  return {
    name: "new group",
    id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    description: "new group description",
    location: "Bloomington, IL, 61701",
    slug: "new-group-slug-name",
    created_at: "2026-04-01T19:57:58.721Z",
    updated_at: "2026-04-01T19:57:58.721Z",
    organizer_id: "user-1",
    category_id: "category-id",
    ...overrides,
  };
}

export function makeNotificationNewOrSeen(
  overrides: Partial<NotificationSchemaType> = {},
): NotificationSchemaType {
  return {
    created_at: "2026-04-01T19:57:58.721Z",
    updated_at: "2026-04-01T19:57:58.721Z",
    group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    id: "new-notification-1-id",
    subject: "new-notification-1 subject",
    message: "new-notification-1-message",
    priority: "high",
    status: "new",
    user_id: "user-1",
    ...overrides,
  };
}

export function makeNotification(
  overrides: Partial<NotificationSchemaType> = {},
): NotificationCreationProcedure {
  return {
    ok: true,
    items: [
      {
        created_at: "2026-04-01T19:57:58.721Z",
        updated_at: "2026-04-01T19:57:58.721Z",
        group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
        id: "new-notification-1-id",
        subject: "new-notification-1 subject",
        message: "new-notification-1-message",
        priority: "high",
        status: "new",
        user_id: "user-1",
        ...overrides,
      },
    ],
  };
}

export function makeAttendanceUpdate(
  overrides: Partial<EventAttendantsSchemaType> = {},
  newStatus?: EventAttendantsSchemaType["status"],
): EventAttendantsSchemaType {
  return {
    event_id: "event-1",
    user_id: "user-1",
    created_at: "2026-04-01T19:57:58.721Z",
    updated_at: "2026-04-01T19:57:58.721Z",
    status: newStatus ?? "interested",
    ...overrides,
  };
}

export function makeMembership(
  overrides: Partial<GroupMemberSchemaType>,
): GroupMemberSchemaType {
  return {
    user_id: "user-1",
    group_id: "group-1",
    role: "member",
    joined_at: "2026-04-01T19:57:58.721Z",
    ...overrides,
  };
}

export function makeDtoMembership(
  overrides: Partial<UserMembershipSchemaType>,
): UserMembershipSchemaType {
  return {
    group_id: "group-1",
    group_description: "group description",
    group_name: "group name",
    location: "online",
    member_count: 3,
    group_slug: "some-group-slug",
    roleInGroup: "member",
    ...overrides,
  };
}

export function makeRsvp(overrides: Partial<RsvpSchemaType>): RsvpSchemaType {
  return {
    group_id: "5cf76d94-83c9-46de-90ac-fe4047a00000",
    group_name: "new group",
    location: "Online",
    group_slug: "new-group-slug-name",
    attendance_status: "going",
    event_id: "event-1",
    event_title: "Design Trends Worth Paying Attention To in 2026",
    starts_at: "2026-04-15T17:30:00.000Z",
    starts_at_ms: new Date("2026-04-15T17:30:00.000Z").getTime(),
    scheduled_status: "scheduled",
    ...overrides,
  };
}
