import { MembershipHandler } from "@/src/server/core/service/handlers/membershipHandler";
import {
  authenticateAs,
  dbMock,
  makeMembership,
  policyMock,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("MembershipHandler", () => {
  const addNewMemberInDb = dbMock.groupMembers.addNewMember as jest.Mock;
  const removeMemberInDb = dbMock.groupMembers.removeMember as jest.Mock;
  const getMembershipRoleInDb = dbMock.groupMembers
    .getMembershipRole as jest.Mock;
  const getGroupMembersInDb = dbMock.groupMembers.getGroupMembers as jest.Mock;

  const groupId = "group-1";
  const userId = "user-1";

  let handler: MembershipHandler;

  beforeEach(() => {
    jest.resetAllMocks();
    handler = new MembershipHandler(dbMock, policyMock);
  });

  describe("addMember", () => {
    it("throws a 401 error when the user is not authenticated", async () => {
      unauthenticated();

      await expect(handler.addMember(undefined, groupId)).rejects.toThrow("401");

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

      await expect(handler.leaveGroup(groupId, userId)).resolves.toBeUndefined();

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

      expect(getMembershipRoleInDb).toHaveBeenCalledWith(userId, groupId);
    });

    it("returns anonymous when the membership role is missing", async () => {
      getMembershipRoleInDb.mockResolvedValue(null);

      await expect(handler.getRoleInGroup(userId, groupId)).resolves.toBe(
        "anonymous",
      );

      expect(getMembershipRoleInDb).toHaveBeenCalledWith(userId, groupId);
    });
  });

  describe("getGroupHeadCount", () => {
    it("returns the number of members in the group", async () => {
      getGroupMembersInDb.mockResolvedValue([
        makeMembership({ user_id: "user-1", group_id: groupId }),
        makeMembership({ user_id: "user-2", group_id: groupId }),
        makeMembership({ user_id: "user-3", group_id: groupId }),
      ]);

      await expect(handler.getGroupHeadCount(groupId)).resolves.toBe(3);

      expect(getGroupMembersInDb).toHaveBeenCalledWith(groupId);
    });
  });
});
