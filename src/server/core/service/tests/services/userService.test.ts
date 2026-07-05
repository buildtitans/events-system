import { UserService } from "@/src/server/core/service/services/userService";
import {
  createMockDb,
  groups,
  makeGroup,
  policyMock,
  authenticateAs,
  unauthenticated,
  makeMembership,
  dtoMemberships,
} from "@/src/server/core/service/tests/mockers/mocks";
import {
  GROUP_ID_1,
  GROUP_ID_2,
  GROUP_ID_3,
  USER_ID,
} from "../mockers/mockValues";

describe("UserService.createNewUser", () => {
  let service: UserService;
  let db: ReturnType<typeof createMockDb>;
  let signUpInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    signUpInDb = db.auth.signUp as jest.Mock;
    service = new UserService(db, policyMock);
  });

  it("trims and lowercases the email before signing up", async () => {
    signUpInDb.mockResolvedValue({ user: { id: "user-1" } });

    await expect(
      service.createNewUser("  Alice@Example.COM  ", "password-123"),
    ).resolves.toEqual({ user: { id: "user-1" } });

    expect(signUpInDb).toHaveBeenCalledWith(
      "alice@example.com",
      "password-123",
    );
  });
});

describe("getMemberships", () => {
  let service: UserService;
  let db: ReturnType<typeof createMockDb>;
  let getGroupsInDb: jest.Mock;
  let getViewerMembershipsInDb: jest.Mock;
  let getMemberCountsByGroupIdsInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getGroupsInDb = db.groups.select.all as jest.Mock;
    getViewerMembershipsInDb = db.groupMembers.select.byUserId as jest.Mock;
    getMemberCountsByGroupIdsInDb =
      db.groupMembers.select.memberCounts as jest.Mock;
    service = new UserService(db, policyMock);
  });

  it("throws a 401 status for a user that is not authenticated", async () => {
    unauthenticated();

    await expect(service.getMemberships(undefined)).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(undefined);
    expect(getGroupsInDb).not.toHaveBeenCalled();
    expect(getViewerMembershipsInDb).not.toHaveBeenCalled();
  });

  it("returns memberships associated with the authenticated user", async () => {
    authenticateAs();

    getGroupsInDb.mockResolvedValue(groups);

    getViewerMembershipsInDb.mockResolvedValue([
      makeMembership({ user_id: USER_ID, group_id: GROUP_ID_1 }),
      makeMembership({ user_id: USER_ID, group_id: GROUP_ID_2 }),
      makeMembership({ user_id: USER_ID, group_id: GROUP_ID_3 }),
    ]);

    getMemberCountsByGroupIdsInDb.mockResolvedValue({
      [GROUP_ID_1]: 3,
      [GROUP_ID_2]: 5,
      [GROUP_ID_3]: 7,
    });

    await expect(service.getMemberships(USER_ID)).resolves.toEqual(
      dtoMemberships,
    );

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
    expect(getViewerMembershipsInDb).toHaveBeenCalledWith(USER_ID);
  });
});

describe("UserService.getGroupsCreated", () => {
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

    await expect(service.getGroupsCreated(undefined)).rejects.toThrow("401");

    expect(getGroupsByOrganizerIdinDb).not.toHaveBeenCalled();
  });

  it("Returns an array of groups created by an authenticated user", async () => {
    authenticateAs();

    getGroupsByOrganizerIdinDb.mockResolvedValue(groupsByUser);

    await expect(service.getGroupsCreated("user-1")).resolves.toEqual([
      groupsByUser,
    ]);

    expect(getGroupsByOrganizerIdinDb).toHaveBeenCalled();
    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
  });
});

describe("UserService.getEmailById", () => {
  let service: UserService;
  let db: ReturnType<typeof createMockDb>;
  let getEmailByUserIdInDb: jest.Mock;

  const email = "alice@example.com";
  const user_id = "user-1";

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getEmailByUserIdInDb = db.auth.getEmailByUserId as jest.Mock;
    service = new UserService(db, policyMock);
  });

  it("Returns the email of an authenticated user", async () => {
    authenticateAs(user_id);

    getEmailByUserIdInDb.mockResolvedValue({ email: email });

    await expect(service.getEmailById("user-1")).resolves.toBe(email);

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getEmailByUserIdInDb).toHaveBeenCalled();
  });
});
