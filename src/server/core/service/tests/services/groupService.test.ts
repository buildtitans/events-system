import type { NewGroupInputSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupService } from "@/src/server/core/service/services/groupService";
import {
  policyMock,
  dbMock,
  makeGroup,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

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
    unauthenticated();

    await expect(
      service.groupLifecycle.createNewGroup(null, newGroup),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(policyMock.requireCanManageGroup).not.toHaveBeenCalled();
    expect(createNewGroupInDb).not.toHaveBeenCalled();
  });

  it("creates a new group", async () => {
    authenticateAs();

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

describe("GroupService.getGroupNameDictionary", () => {
  const getGroupsInDb = dbMock.groups.getGroups as jest.Mock;

  let service: GroupService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GroupService(dbMock, policyMock);
  });

  it("returns a name, slug, and description lookup keyed by group id", async () => {
    const groups = [
      makeGroup({
        id: "group-1",
        name: "Board Game Nights",
        slug: "board-game-nights",
        description: "Games every Friday night",
      }),
      makeGroup({
        id: "group-2",
        name: "Frontend Study Group",
        slug: "frontend-study-group",
        description: "Weekly frontend practice sessions",
      }),
    ];

    getGroupsInDb.mockResolvedValue(groups);

    await expect(service.getGroupNameDictionary()).resolves.toEqual({
      "group-1": {
        name: "Board Game Nights",
        slug: "board-game-nights",
        group_description: "Games every Friday night",
      },
      "group-2": {
        name: "Frontend Study Group",
        slug: "frontend-study-group",
        group_description: "Weekly frontend practice sessions",
      },
    });

    expect(getGroupsInDb).toHaveBeenCalled();
  });
});

describe("GroupService.getOrganizerEmail", () => {
  const getOrganizerInDb = dbMock.groupMembers.getOrganizer as jest.Mock;
  const getEmailByUserIdInDb = dbMock.auth.getEmailByUserId as jest.Mock;

  let service: GroupService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GroupService(dbMock, policyMock);
  });

  it("returns the organizer email for the group", async () => {
    getOrganizerInDb.mockResolvedValue({
      user_id: "organizer-1",
      group_id: "group-1",
      role: "organizer",
      joined_at: "2026-04-01T19:57:58.721Z",
    });

    getEmailByUserIdInDb.mockResolvedValue({
      email: "organizer@example.com",
    });

    await expect(service.getOrganizerEmail("group-1")).resolves.toEqual({
      email: "organizer@example.com",
    });

    expect(getOrganizerInDb).toHaveBeenCalledWith("group-1");
    expect(getEmailByUserIdInDb).toHaveBeenCalledWith("organizer-1");
  });
});
