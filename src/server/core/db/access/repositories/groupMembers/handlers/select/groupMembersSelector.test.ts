import { IGroupMembersReader } from "./groupMembersReader";
import { GroupMembersSelector } from "./groupMembersSelector";
import { GroupMembersValidator } from "../validate/groupMembersValidator";
import { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";

function createSelector() {
  const read: jest.Mocked<Pick<IGroupMembersReader, "role">> = {
    role: jest.fn(),
  };
  const selector = new GroupMembersSelector(
    read as unknown as IGroupMembersReader,
    new GroupMembersValidator(),
  );
  return { read, selector };
}

describe("GroupMembersSelector", () => {
  it("returns anonymous when the reader finds no membership", async () => {
    const { read, selector } = createSelector();
    read.role.mockResolvedValue("anonymous");

    await expect(
      selector.role("group-1", "user-1" as AuthenticatedUserId),
    ).resolves.toBe("anonymous");
    expect(read.role).toHaveBeenCalledWith("group-1", "user-1");
  });
});
