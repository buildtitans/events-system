import type {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { GroupService } from "../services/groupService";
import { policyMock, dbMock } from "./modules/mocks";

export function makeGroup(
  overrides: Partial<GroupSchemaType> = {},
): GroupSchemaType {
  return {
    name: "new group",
    id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    description: "new group description",
    location: "Bloomington, IL, 61701",
    slug: "new-group-slug-name",
    created_at: "2026-04-01T19:57:58.721Z",
    updated_at: "2026-04-01T19:57:58.721Z",
    organizer_id: "user-1",
    category_id: "category-id",
    ...overrides,
  };
}

describe("GroupService.groupLifecycle.createNewGroup", () => {
  const createNewGroupInDb = dbMock.groups.createGroup as jest.Mock;
  const assignOrganizerToNewGroupInDb = dbMock.groupMembers
    .addOrganizer as jest.Mock;

  const newGroup = {
    name: "new-group-1",
    description: "new-group-1 description",
    location: "Online",
    category_id: "new-group-1-category_id",
  } satisfies NewGroupInputSchemaType;

  const group = makeGroup(newGroup);

  let service: GroupService;

  beforeEach(() => {
    (jest.clearAllMocks(), (service = new GroupService(dbMock, policyMock)));
  });

  it("throws a 401 status when the user is not authenticated", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockImplementation(() => {
      throw new Error("401");
    });

    await expect(
      service.groupLifecycle.createNewGroup(null, newGroup),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(policyMock.requireCanManageGroup).not.toHaveBeenCalled();
    expect(createNewGroupInDb).not.toHaveBeenCalled();
  });

  it("creates a new group", async () => {
    (policyMock.requireAuthenticated as jest.Mock).mockImplementation(() => {
      return "user-1";
    });

    createNewGroupInDb.mockResolvedValue({
      name: "new-group-1",
      description: "new-group-1 description",
      location: "Online",
      category_id: "new-group-1-category_id",
      id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
      slug: "new-group-slug-name",
      created_at: "2026-04-01T19:57:58.721Z",
      updated_at: "2026-04-01T19:57:58.721Z",
      organizer_id: "user-1",
    });

    assignOrganizerToNewGroupInDb.mockResolvedValue({
      group_id: group.id,
      user_id: group.organizer_id,
      role: "organizer",
      joined_at: "2026-04-01T19:57:58.721Z",
    });

    await expect(
      service.groupLifecycle.createNewGroup("user-1", newGroup),
    ).resolves.toMatchObject(group);

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(createNewGroupInDb).toHaveBeenCalledWith(newGroup, "user-1");
    expect(assignOrganizerToNewGroupInDb).toHaveBeenCalledWith({
      user_id: "user-1",
      group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    });
  });
});
