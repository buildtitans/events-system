import { SessionService } from "@/src/server/core/service/services/SessionService";
import {
  createMockDb,
  policyMock,
  emailServiceMock,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("SessionService.login", () => {
  let service: SessionService;
  let db: ReturnType<typeof createMockDb>;
  let loginInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    loginInDb = db.auth.login as jest.Mock;
    service = new SessionService(db, policyMock, emailServiceMock);
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
  let service: SessionService;
  let db: ReturnType<typeof createMockDb>;
  let logOutInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    logOutInDb = db.auth.logOut as jest.Mock;
    service = new SessionService(db, policyMock, emailServiceMock);
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
  let service: SessionService;
  let db: ReturnType<typeof createMockDb>;
  let getSessionInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    getSessionInDb = db.auth.getSession as jest.Mock;
    service = new SessionService(db, policyMock, emailServiceMock);
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

describe("SessionService.resetPassword", () => {
  let service: SessionService;
  let db: ReturnType<typeof createMockDb>;
  let resetPasswordInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    resetPasswordInDb = db.auth.resetPassword as jest.Mock;
    service = new SessionService(db, policyMock, emailServiceMock);
  });

  it("returns ok true when the password reset succeeds", async () => {
    resetPasswordInDb.mockResolvedValue(true);

    await expect(
      service.resetPassword("reset-token", "password-123"),
    ).resolves.toEqual({ ok: true });

    expect(resetPasswordInDb).toHaveBeenCalledWith(
      "reset-token",
      "password-123",
    );
  });

  it("throws when the reset token is invalid or expired", async () => {
    resetPasswordInDb.mockResolvedValue(false);

    await expect(
      service.resetPassword("expired-token", "password-123"),
    ).rejects.toThrow("This password reset link is invalid or has expired.");
  });
});

describe("SessionService.emailForPwReset", () => {
  let emailerMock = emailServiceMock.request as jest.Mock;
  let service: SessionService;
  let db: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    emailerMock = emailServiceMock.request as jest.Mock;
    service = new SessionService(db, policyMock, emailServiceMock);
  });

  it("delegates the password reset request to the injected emailer", async () => {
    emailerMock.mockResolvedValue({ ok: true });

    await expect(service.emailForPwReset("alice@example.com")).resolves.toEqual(
      {
        ok: true,
      },
    );

    expect(emailerMock).toHaveBeenCalledWith("alice@example.com");
  });
});
