import { UserService } from "@/src/server/core/service/services/userService";
import {
  createMockDb,
  makeGroup,
  policyMock,
  authenticateAs,
  unauthenticated,
  dtoMemberships,
} from "@/src/server/core/service/tests/mockers/mocks";
import { USER_ID } from "../mockers/mockValues";

describe("UserService.select.memberships", () => {
  let service: UserService;
  let db: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    service = new UserService(db, policyMock);
  });

  it("rejects unauthenticated users before reading memberships", async () => {
    unauthenticated();
    await expect(service.select.memberships(undefined)).rejects.toThrow("401");
    expect(db.groupMembers.select.memberships).not.toHaveBeenCalled();
  });

  it("returns membership surfaces for the authenticated user", async () => {
    authenticateAs();
    const surfaces = dtoMemberships.map((membership) => ({
      membership,
      meta: {
        member_headcount: 3,
        schedule: { timeline_status: "no_events" as const },
      },
    }));
    (db.groupMembers.select.memberships as jest.Mock).mockResolvedValue(surfaces);

    await expect(service.select.memberships(USER_ID)).resolves.toEqual(surfaces);
    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
    expect(db.groupMembers.select.memberships).toHaveBeenCalledWith(USER_ID);
    expect(db.groups.select.all).not.toHaveBeenCalled();
  });
});

describe("UserService.select.groups", () => {
  let service: UserService;
  let db: ReturnType<typeof createMockDb>;
  let getGroupsByOrganizerIdinDb: jest.Mock;

  const groupsByUser = [
    makeGroup({
      organizer_id: "user-1",
      id: "5cf76d94-83c9-46de-90ac-fe4047a00000",
    }),
    makeGroup({
      organizer_id: "user-1",
      id: "9cf76d94-83c9-46de-90ac-fe4047a00000",
    }),
    makeGroup({
      organizer_id: "user-1",
      id: "1cf76d94-83c9-46de-90ac-fe4047a00000",
    }),
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getGroupsByOrganizerIdinDb = db.groups.select.byOrganizerId as jest.Mock;
    service = new UserService(db, policyMock);
  });

  it("Throws a 401 error when the user is not authenticated", async () => {
    unauthenticated();

    await expect(service.select.groups(undefined)).rejects.toThrow("401");

    expect(getGroupsByOrganizerIdinDb).not.toHaveBeenCalled();
  });

  it("Returns an array of groups created by an authenticated user", async () => {
    authenticateAs();

    getGroupsByOrganizerIdinDb.mockResolvedValue(groupsByUser);

    await expect(service.select.groups(USER_ID)).resolves.toEqual([
      groupsByUser,
    ]);

    expect(getGroupsByOrganizerIdinDb).toHaveBeenCalled();
    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
  });
});

describe("UserService.select.email", () => {
  let service: UserService;
  let db: ReturnType<typeof createMockDb>;
  let getEmailByUserIdInDb: jest.Mock;

  const email = "alice@example.com";
  const user_id = USER_ID;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getEmailByUserIdInDb = db.auth.getEmailByUserId as jest.Mock;
    service = new UserService(db, policyMock);
  });

  it("Returns the email of an authenticated user", async () => {
    authenticateAs(user_id);

    getEmailByUserIdInDb.mockResolvedValue({ email: email });

    await expect(service.select.email(USER_ID)).resolves.toBe(email);

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getEmailByUserIdInDb).toHaveBeenCalled();
  });
});
