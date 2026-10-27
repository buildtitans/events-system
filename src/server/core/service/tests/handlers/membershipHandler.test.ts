import { USER_ID } from "../mockers/mockValues";
import { MembershipHandler } from "@/src/server/core/service/handlers/groups/membershipHandler";
import {
  authenticateAs,
  createMockDb,
  makeMembership,
  policyMock,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("MembershipHandler", () => {
  const groupId = "group-1";
  const userId = USER_ID;

  let handler: MembershipHandler;
  let db: ReturnType<typeof createMockDb>;
  let addNewMemberInDb: jest.Mock;
  let removeMemberInDb: jest.Mock;
  let getMembershipRoleInDb: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    db = createMockDb();
    addNewMemberInDb = db.groupMembers.write.newMember as jest.Mock;
    removeMemberInDb = db.groupMembers.write.removeMember as jest.Mock;
    getMembershipRoleInDb = db.groupMembers.select.role as jest.Mock;
    handler = new MembershipHandler(db, policyMock);
  });

  describe("addMember", () => {
    it("throws a 401 error when the user is not authenticated", async () => {
      unauthenticated();

      await expect(handler.addMember(undefined, groupId)).rejects.toThrow(
        "401",
      );

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(undefined);
      expect(policyMock.requireCanChangeMembership).not.toHaveBeenCalled();
      expect(addNewMemberInDb).not.toHaveBeenCalled();
    });

    it("throws a 403 error when the user cannot change membership", async () => {
      authenticateAs();
      (policyMock.requireCanChangeMembership as jest.Mock).mockImplementation(
        () => {
          throw new Error("403");
        },
      );

      await expect(handler.addMember(userId, groupId)).rejects.toThrow("403");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(userId);
      expect(policyMock.requireCanChangeMembership).toHaveBeenCalledWith(
        userId,
        groupId,
      );
      expect(addNewMemberInDb).not.toHaveBeenCalled();
    });

    it("adds a member when the user is authenticated and authorized", async () => {
      authenticateAs();
      (policyMock.requireCanChangeMembership as jest.Mock).mockResolvedValue(
        undefined,
      );

      const membership = makeMembership({ user_id: userId, group_id: groupId });
      addNewMemberInDb.mockResolvedValue(membership);

      await expect(handler.addMember(userId, groupId)).resolves.toEqual(
        membership,
      );

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(userId);
      expect(policyMock.requireCanChangeMembership).toHaveBeenCalledWith(
        userId,
        groupId,
      );
      expect(addNewMemberInDb).toHaveBeenCalledWith({
        user_id: userId,
        group_id: groupId,
      });
    });
  });

  describe("leaveGroup", () => {
    it("throws a 401 error when the user is not authenticated", async () => {
      unauthenticated();

      await expect(handler.leaveGroup(groupId, null)).rejects.toThrow("401");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(null);
      expect(policyMock.requireCanChangeMembership).not.toHaveBeenCalled();
      expect(removeMemberInDb).not.toHaveBeenCalled();
    });

    it("throws a 403 error when the user cannot leave the group", async () => {
      authenticateAs();
      (policyMock.requireCanChangeMembership as jest.Mock).mockImplementation(
        () => {
          throw new Error("403");
        },
      );

      await expect(handler.leaveGroup(groupId, userId)).rejects.toThrow("403");

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(userId);
      expect(policyMock.requireCanChangeMembership).toHaveBeenCalledWith(
        userId,
        groupId,
      );
      expect(removeMemberInDb).not.toHaveBeenCalled();
    });

    it("removes the member when the user is authenticated and authorized", async () => {
      authenticateAs();
      (policyMock.requireCanChangeMembership as jest.Mock).mockResolvedValue(
        undefined,
      );
      removeMemberInDb.mockResolvedValue(undefined);

      await expect(
        handler.leaveGroup(groupId, userId),
      ).resolves.toBeUndefined();

      expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(userId);
      expect(policyMock.requireCanChangeMembership).toHaveBeenCalledWith(
        userId,
        groupId,
      );
      expect(removeMemberInDb).toHaveBeenCalledWith(userId, groupId);
    });
  });

  describe("getRoleInGroup", () => {
    it("returns anonymous when there is no user id", async () => {
      await expect(handler.getRoleInGroup(undefined, groupId)).resolves.toBe(
        "anonymous",
      );

      expect(getMembershipRoleInDb).not.toHaveBeenCalled();
    });

    it("returns the group role when one exists", async () => {
      getMembershipRoleInDb.mockResolvedValue("member");

      await expect(handler.getRoleInGroup(userId, groupId)).resolves.toBe(
        "member",
      );

      expect(getMembershipRoleInDb).toHaveBeenCalledWith(groupId, userId);
    });

    it("returns anonymous when the selector reports no membership", async () => {
      getMembershipRoleInDb.mockResolvedValue("anonymous");

      await expect(handler.getRoleInGroup(userId, groupId)).resolves.toBe(
        "anonymous",
      );

      expect(getMembershipRoleInDb).toHaveBeenCalledWith(groupId, userId);
    });
  });
});
