import { UserService } from "@/src/server/core/service/services/userService";
import {
  dbMock,
  makeGroup,
  policyMock,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("UserService.createNewUser", () => {
  const signUpInDb = dbMock.auth.signUp as jest.Mock;

  let service: UserService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new UserService(dbMock, policyMock);
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

describe("UserService.getGroupsCreated", () => {
  const getGroupsByOrganizerIdinDb = dbMock.groups
    .getGroupsByOrganizerId as jest.Mock;

  let service: UserService;

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
    service = new UserService(dbMock, policyMock);
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
  const getEmailByUserIdInDb = dbMock.auth.getEmailByUserId as jest.Mock;

  let service: UserService;

  const email = "alice@example.com";
  const user_id = "user-1";

  beforeEach(() => {
    jest.resetAllMocks();
    service = new UserService(dbMock, policyMock);
  });

  it("Returns the email of an authenticated user", async () => {
    authenticateAs(user_id);

    getEmailByUserIdInDb.mockResolvedValue({ email: email });

    await expect(service.getEmailById("user-1")).resolves.toBe(email);

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(getEmailByUserIdInDb).toHaveBeenCalled();
  });
});
