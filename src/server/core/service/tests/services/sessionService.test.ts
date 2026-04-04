import { SessionService } from "@/src/server/core/service/services/SessionService";
import {
  dbMock,
  policyMock,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("SessionService.login", () => {
  const loginInDb = dbMock.auth.login as jest.Mock;

  let service: SessionService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new SessionService(dbMock, policyMock);
  });

  it("trims and lowercases the email before logging in", async () => {
    loginInDb.mockResolvedValue({ session: { id: "session-1" } });

    await expect(
      service.login("  Alice@Example.COM  ", "password-123"),
    ).resolves.toEqual({ session: { id: "session-1" } });

    expect(loginInDb).toHaveBeenCalledWith("alice@example.com", "password-123");
  });

  it("throws when the login input is invalid", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    try {
      await expect(
        service.login("not-an-email", "password-123"),
      ).rejects.toThrow();

      expect(loginInDb).not.toHaveBeenCalled();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

describe("SessionService.logout", () => {
  const logOutInDb = dbMock.auth.logOut as jest.Mock;

  let service: SessionService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new SessionService(dbMock, policyMock);
  });

  it("throws when no token is provided", async () => {
    (policyMock.requireToken as jest.Mock).mockImplementation(() => {
      throw new Error("404");
    });

    await expect(service.logout(undefined)).rejects.toThrow("404");

    expect(policyMock.requireToken).toHaveBeenCalledWith(undefined);
    expect(logOutInDb).not.toHaveBeenCalled();
  });

  it("logs out using the validated token", async () => {
    (policyMock.requireToken as jest.Mock).mockReturnValue("session-token");
    logOutInDb.mockResolvedValue(undefined);

    await expect(service.logout("session-token")).resolves.toBeUndefined();

    expect(policyMock.requireToken).toHaveBeenCalledWith("session-token");
    expect(logOutInDb).toHaveBeenCalledWith("session-token");
  });
});

describe("SessionService.recoverSession", () => {
  const getSessionInDb = dbMock.auth.getSession as jest.Mock;

  let service: SessionService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new SessionService(dbMock, policyMock);
  });

  it("throws when no token is provided", async () => {
    (policyMock.requireToken as jest.Mock).mockImplementation(() => {
      throw new Error("404");
    });

    await expect(service.recoverSession(null)).rejects.toThrow("404");

    expect(policyMock.requireToken).toHaveBeenCalledWith(null);
    expect(getSessionInDb).not.toHaveBeenCalled();
  });

  it("returns the recovered session for a valid token", async () => {
    const session = {
      id: "session-1",
      user_id: "user-1",
      expires_at: "2026-05-01T00:00:00.000Z",
    };

    (policyMock.requireToken as jest.Mock).mockReturnValue("session-token");
    getSessionInDb.mockResolvedValue(session);

    await expect(service.recoverSession("session-token")).resolves.toEqual(
      session,
    );

    expect(policyMock.requireToken).toHaveBeenCalledWith("session-token");
    expect(getSessionInDb).toHaveBeenCalledWith("session-token");
  });
});
