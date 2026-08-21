import "@/src/schemas/format";
import type { TRPCContext } from "@/src/server/core/context/types";
import { InvalidCredentialsError } from "@/src/server/core/lib/errors/invalidCredentialsError";
import { authRouter } from "@/src/server/core/router/routes/authRouter";

jest.mock("superjson", () => ({
  __esModule: true,
  default: {
    serialize: (value: unknown) => value,
    deserialize: (value: unknown) => value,
  },
}));

const credentials = {
  email: "viewer@example.com",
  password: "password-123",
};

function createLoginCaller(login: jest.Mock) {
  const setCookieHeader = jest.fn();
  const caller = authRouter.createCaller({
    services: {
      api: {
        domains: {
          session: { login },
        },
      },
    },
    session: {
      setCookieHeader,
      removeCookieHeader: jest.fn(),
    },
    req: { cookies: {} },
    res: {},
  } as unknown as TRPCContext);

  return { caller, setCookieHeader };
}

describe("authRouter.session.login", () => {
  it("sets the session cookie and returns only the public login response", async () => {
    const session = {
      id: "session-secret",
      expires_at: new Date("2026-08-21T12:00:00.000Z"),
      user_id: "user-1",
    };
    const user = {
      id: "user-1",
      email: credentials.email,
    };
    const login = jest.fn().mockResolvedValue({
      status: "ok",
      session,
      user,
    });
    const { caller, setCookieHeader } = createLoginCaller(login);

    const response = await caller.session.login(credentials);

    expect(response).toEqual({
      status: "ok",
      email: credentials.email,
    });
    expect(response).not.toHaveProperty("session");
    expect(response).not.toHaveProperty("user");
    expect(setCookieHeader).toHaveBeenCalledWith(session, user);
  });

  it("translates invalid credentials to UNAUTHORIZED", async () => {
    const login = jest.fn().mockRejectedValue(new InvalidCredentialsError());
    const { caller, setCookieHeader } = createLoginCaller(login);

    await expect(caller.session.login(credentials)).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
    expect(setCookieHeader).not.toHaveBeenCalled();
  });

  it("does not translate unexpected login failures", async () => {
    const databaseError = new Error("database unavailable");
    const login = jest.fn().mockRejectedValue(databaseError);
    const { caller, setCookieHeader } = createLoginCaller(login);

    await expect(caller.session.login(credentials)).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      cause: databaseError,
    });
    expect(setCookieHeader).not.toHaveBeenCalled();
  });
});
