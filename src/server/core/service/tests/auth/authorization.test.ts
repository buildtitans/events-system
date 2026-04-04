import { Authorization } from "@/src/server/core/service/auth/authorization";
import { TRPCResolverError } from "@/src/server/core/lib/errors/trpcResolverError";

describe("Authorization", () => {
  const authMock = {
    can: jest.fn(),
  };

  let policy: Authorization;

  beforeEach(() => {
    jest.resetAllMocks();
    policy = new Authorization(authMock as any);
  });

  describe("requireAuthenticated", () => {
    it("returns the user id when one is provided", () => {
      expect(policy.requireAuthenticated("user-1")).toBe("user-1");
    });

    it("throws a 401 error when the user is not authenticated", () => {
      expect(() => policy.requireAuthenticated(undefined)).toThrow(
        TRPCResolverError,
      );
      expect(() => policy.requireAuthenticated(undefined)).toThrow(
        "Authentication required",
      );
    });
  });

  describe("requireToken", () => {
    it("returns the token when one is provided", () => {
      expect(policy.requireToken("session-token")).toBe("session-token");
    });

    it("throws a 404 error when the token is missing", () => {
      expect(() => policy.requireToken(null)).toThrow(TRPCResolverError);
      expect(() => policy.requireToken(null)).toThrow("Could not find token");
    });
  });

  describe("requireCanCreateEvent", () => {
    it("resolves when the user is permitted to create an event", async () => {
      authMock.can.mockResolvedValue(true);

      await expect(
        policy.requireCanCreateEvent("user-1", "group-1"),
      ).resolves.toBeUndefined();

      expect(authMock.can).toHaveBeenCalledWith(
        "user-1",
        "group-1",
        "manage events",
      );
    });

    it("throws a 403 error when the user is not permitted to create an event", async () => {
      authMock.can.mockResolvedValue(false);

      await expect(
        policy.requireCanCreateEvent("user-1", "group-1"),
      ).rejects.toThrow("Permission to create an event denied");
    });
  });

  describe("requireCanManageGroup", () => {
    it("resolves when the user is permitted to manage the group", async () => {
      authMock.can.mockResolvedValue(true);

      await expect(
        policy.requireCanManageGroup("user-1", "group-1"),
      ).resolves.toBeUndefined();

      expect(authMock.can).toHaveBeenCalledWith(
        "user-1",
        "group-1",
        "manage group",
      );
    });

    it("throws a 403 error when the user is not permitted to manage the group", async () => {
      authMock.can.mockResolvedValue(false);

      await expect(
        policy.requireCanManageGroup("user-1", "group-1"),
      ).rejects.toThrow("Permission to manage this group denied");
    });
  });

  describe("requireCanChangeMembership", () => {
    it("resolves when the user is permitted to change membership", async () => {
      authMock.can.mockResolvedValue(true);

      await expect(
        policy.requireCanChangeMembership("user-1", "group-1"),
      ).resolves.toBeUndefined();

      expect(authMock.can).toHaveBeenCalledWith(
        "user-1",
        "group-1",
        "change membership",
      );
    });

    it("throws a 403 error when the user is not permitted to change membership", async () => {
      authMock.can.mockResolvedValue(false);

      await expect(
        policy.requireCanChangeMembership("user-1", "group-1"),
      ).rejects.toThrow("Permission to manage this group denied");
    });
  });
});
