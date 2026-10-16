import { USER_ID } from "../mockers/mockValues";
import type { ArchivedEventSchemaType, NewGroupInputSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupService } from "@/src/server/core/service/services/groupService";
import {
  policyMock,
  createMockDb,
  makeGroup,
  makeEvent,
  authenticateAs,
  unauthenticated,
} from "@/src/server/core/service/tests/mockers/mocks";

describe("GroupService.groupLifecycle.createNewGroup", () => {
  const newGroup = {
    name: "new-group-1",
    description: "new-group-1 description",
    location: "Online",
    category_id: "new-group-1-category_id",
  } satisfies NewGroupInputSchemaType;

  const group = makeGroup(newGroup);

  let service: GroupService;
  let db: ReturnType<typeof createMockDb>;
  let createNewGroupInDb: jest.Mock;
  let assignOrganizerToNewGroupInDb: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    db = createMockDb();
    createNewGroupInDb = db.groups.write.createGroup as jest.Mock;
    assignOrganizerToNewGroupInDb =
      db.groupMembers.write.addOrganizer as jest.Mock;
    service = new GroupService(db, policyMock);
  });

  it("throws a 401 status when the user is not authenticated", async () => {
    unauthenticated();

    await expect(
      service.groupLifecycle.createNewGroup(null, newGroup),
    ).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(policyMock.requireOrganizer).not.toHaveBeenCalled();
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
      service.groupLifecycle.createNewGroup(USER_ID, newGroup),
    ).resolves.toEqual({ ok: true, data: group });

    expect(policyMock.requireAuthenticated).toHaveBeenCalled();
    expect(createNewGroupInDb).toHaveBeenCalledWith(newGroup, "user-1");
    expect(assignOrganizerToNewGroupInDb).toHaveBeenCalledWith({
      user_id: "user-1",
      group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
    });
  });
});

describe("GroupService.query.archives", () => {
  const groupId = "group-1";
  let service: GroupService;
  let getArchives: jest.MockedFunction<
    ReturnType<typeof createMockDb>["groups"]["select"]["archives"]
  >;

  beforeEach(() => {
    jest.resetAllMocks();
    const db = createMockDb();
    getArchives = jest.mocked(db.groups.select.archives);
    service = new GroupService(db, policyMock);
    authenticateAs();
  });

  it("rejects an unauthenticated user without reading archives", async () => {
    unauthenticated();

    await expect(service.query.archives(undefined, groupId)).rejects.toThrow("401");

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(undefined);
    expect(policyMock.requireOrganizer).not.toHaveBeenCalled();
    expect(getArchives).not.toHaveBeenCalled();
  });

  it("rejects a non-organizer without reading archives", async () => {
    jest.mocked(policyMock.requireOrganizer).mockRejectedValue(new Error("403"));

    await expect(service.query.archives(USER_ID, groupId)).rejects.toThrow("403");

    expect(policyMock.requireOrganizer).toHaveBeenCalledWith(USER_ID, groupId);
    expect(getArchives).not.toHaveBeenCalled();
  });

  it("returns archived events with embedded attendance for the organizer", async () => {
    const archives: ArchivedEventSchemaType[] = [{
      event: makeEvent({ group_id: groupId, status: "cancelled" }),
      attendance: { going: 2, interested: 1 },
    }];
    getArchives.mockResolvedValue(archives);

    await expect(service.query.archives(USER_ID, groupId)).resolves.toEqual(archives);

    expect(policyMock.requireAuthenticated).toHaveBeenCalledWith(USER_ID);
    expect(policyMock.requireOrganizer).toHaveBeenCalledWith(USER_ID, groupId);
    expect(getArchives).toHaveBeenCalledWith(groupId);
  });

  it("returns an empty array when the group has no archives", async () => {
    getArchives.mockResolvedValue([]);

    await expect(service.query.archives(USER_ID, groupId)).resolves.toEqual([]);

    expect(policyMock.requireOrganizer).toHaveBeenCalledWith(USER_ID, groupId);
    expect(getArchives).toHaveBeenCalledWith(groupId);
  });

  it("propagates a database failure instead of returning empty archives", async () => {
    getArchives.mockRejectedValue(new Error("Database unavailable"));

    await expect(service.query.archives(USER_ID, groupId)).rejects.toThrow("Database unavailable");
  });
});

describe("GroupService.getGroupNameDictionary", () => {
  let service: GroupService;
  let db: ReturnType<typeof createMockDb>;
  let getGroupsInDb: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    db = createMockDb();
    getGroupsInDb = db.groups.select.all as jest.Mock;
    service = new GroupService(db, policyMock);
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

    await expect(service.query.getGroupNameDictionary()).resolves.toEqual({
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
  let service: GroupService;
  let db: ReturnType<typeof createMockDb>;
  let getOrganizerInDb: jest.Mock;
  let getEmailByUserIdInDb: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    db = createMockDb();
    getOrganizerInDb = db.groupMembers.select.organizer as jest.Mock;
    getEmailByUserIdInDb = db.auth.getEmailByUserId as jest.Mock;
    service = new GroupService(db, policyMock);
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

    await expect(service.query.getOrganizerEmail("group-1")).resolves.toEqual({
      email: "organizer@example.com",
    });

    expect(getOrganizerInDb).toHaveBeenCalledWith("group-1");
    expect(getEmailByUserIdInDb).toHaveBeenCalledWith("organizer-1");
  });
});
