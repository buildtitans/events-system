import { GroupMembersSelector } from "./groupMembersSelector";
import { GroupMembersValidator } from "./groupMembersValidator";
import type { RawGroupMembersReader } from "./rawGroupMembersReader";

function createSelector() {
  const read: jest.Mocked<
    Pick<RawGroupMembersReader, "rawRoleInGroup">
  > = {
    rawRoleInGroup: jest.fn(),
  };
  const selector = new GroupMembersSelector(
    read as unknown as RawGroupMembersReader,
    new GroupMembersValidator(),
  );
  return { read, selector };
}

describe("GroupMembersSelector", () => {
  it("returns anonymous when the reader finds no membership", async () => {
    const { read, selector } = createSelector();
    read.rawRoleInGroup.mockResolvedValue(undefined);

    await expect(selector.role("user-1", "group-1")).resolves.toBe("anonymous");
    expect(read.rawRoleInGroup).toHaveBeenCalledWith("user-1", "group-1");
  });
});
