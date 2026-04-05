import { RoleBasedAccessHandler } from "@/src/server/core/service/auth/roleBasedAccessHandler";

describe("RoleBasedAccessHandler.can", () => {
  const dbMock = {
    groupMembers: {
      getMembershipRole: jest.fn(),
    },
  };

  let handler: RoleBasedAccessHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    handler = new RoleBasedAccessHandler(dbMock as any);
  });

  it("returns false when there is no user id", async () => {
    await expect(handler.can(undefined, "group-1", "manage group")).resolves.toBe(
      false,
    );

    expect(dbMock.groupMembers.getMembershipRole).not.toHaveBeenCalled();
  });

  it("allows organizers to manage groups", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("organizer");

    await expect(handler.can("user-1", "group-1", "manage group")).resolves.toBe(
      true,
    );

    expect(dbMock.groupMembers.getMembershipRole).toHaveBeenCalledWith(
      "user-1",
      "group-1",
    );
  });

  it("allows organizers to manage events", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("organizer");

    await expect(
      handler.can("user-1", "group-1", "manage events"),
    ).resolves.toBe(true);
  });

  it("does not allow members to manage groups", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("member");

    await expect(handler.can("user-1", "group-1", "manage group")).resolves.toBe(
      false,
    );
  });

  it("does not allow members to manage events", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("member");

    await expect(
      handler.can("user-1", "group-1", "manage events"),
    ).resolves.toBe(false);
  });

  it("allows members to change membership", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("member");

    await expect(
      handler.can("user-1", "group-1", "change membership"),
    ).resolves.toBe(true);
  });

  it("allows anonymous role records to change membership", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("anonymous");

    await expect(
      handler.can("user-1", "group-1", "change membership"),
    ).resolves.toBe(true);
  });

  it("does not allow organizers to change membership", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("organizer");

    await expect(
      handler.can("user-1", "group-1", "change membership"),
    ).resolves.toBe(false);
  });

  it("allows members to read notifications for the group", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("member");

    await expect(
      handler.can("user-1", "group-1", "read or receive notifications"),
    ).resolves.toBe(true);
  });

  it("allows organizers to read notifications for the group", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("organizer");

    await expect(
      handler.can("user-1", "group-1", "read or receive notifications"),
    ).resolves.toBe(true);
  });

  it("does not allow anonymous role records to read notifications for the group", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("anonymous");

    await expect(
      handler.can("user-1", "group-1", "read or receive notifications"),
    ).resolves.toBe(false);
  });

  it("returns false for an unsupported action", async () => {
    dbMock.groupMembers.getMembershipRole.mockResolvedValue("organizer");

    await expect(
      handler.can("user-1", "group-1", "unsupported action" as any),
    ).resolves.toBe(false);
  });
});
