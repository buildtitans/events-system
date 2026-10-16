import { GroupMembersSelector } from "./groupMembersSelector";
import { GroupMembersValidator } from "./groupMembersValidator";
import type { RawGroupMembersReader } from "./rawGroupMembersReader";

function createSelector() {
  const read: jest.Mocked<
    Pick<RawGroupMembersReader, "rawMemberCount" | "rawRoleInGroup">
  > = {
    rawMemberCount: jest.fn(),
    rawRoleInGroup: jest.fn(),
  };
  const selector = new GroupMembersSelector(
    read as unknown as RawGroupMembersReader,
    new GroupMembersValidator(),
  );
  return { read, selector };
}

describe("GroupMembersSelector", () => {
  it.each([
    ["3", 3],
    ["0", 0],
  ])("normalizes a database count of %s", async (rawCount, expected) => {
    const { read, selector } = createSelector();
    read.rawMemberCount.mockResolvedValue({ member_count: rawCount });

    await expect(selector.memberCount("group-1")).resolves.toBe(expected);
    expect(read.rawMemberCount).toHaveBeenCalledWith("group-1");
  });

  it("returns anonymous when the reader finds no membership", async () => {
    const { read, selector } = createSelector();
    read.rawRoleInGroup.mockResolvedValue(undefined);

    await expect(selector.role("user-1", "group-1")).resolves.toBe("anonymous");
    expect(read.rawRoleInGroup).toHaveBeenCalledWith("user-1", "group-1");
  });
});
