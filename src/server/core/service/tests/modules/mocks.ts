import { Authorization } from "@/src/server/core/service/auth/authorization";
import { DBClient } from "../../../db";

export const policyMock = {
  requireAuthenticated: jest.fn(),
  requireCanManageGroup: jest.fn(),
} as unknown as Authorization;

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
