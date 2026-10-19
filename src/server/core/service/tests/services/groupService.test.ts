import { USER_ID } from "../mockers/mockValues";
import type { ArchivedEventSchemaType, NewGroupInputSchemaType } from "@/src/schemas/groups/groupSchema";
import { GroupService } from "@/src/server/core/service/services/groupService";
import {
  policyMock,
  createMockDb,
  makeGroup,
  makeEvent,
  makeGroupEventSummary,
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

describe("GroupService.query.pastEvents", () => {
  let service: GroupService;
  let db: ReturnType<typeof createMockDb>;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-04-06T00:00:00.000Z"));
    db = createMockDb();
    service = new GroupService(db, policyMock);
  });

  afterEach(() => jest.useRealTimers());

  it("returns past summaries with their included going counts in chronological order", async () => {
    const older = makeGroupEventSummary(
      { id: "past-1", starts_at_ms: Date.parse("2026-03-20T12:00:00.000Z") },
      { attendance: { going: 0, interested: 3 } },
    );
    const recent = makeGroupEventSummary(
      { id: "past-2", starts_at_ms: Date.parse("2026-04-05T12:00:00.000Z") },
      { attendance: { going: 2, interested: 4 } },
    );
    const future = makeGroupEventSummary({ id: "future", starts_at_ms: Date.now() + 1 });
    const now = makeGroupEventSummary({ id: "now", starts_at_ms: Date.now() });
    (db.events.select.byGroupId as jest.Mock).mockResolvedValue([recent, future, now, older]);

    await expect(service.query.pastEvents("group-1")).resolves.toEqual([older, recent]);
    expect(db.events.select.byGroupId).toHaveBeenCalledWith("group-1");
  });

  it.each([
    { events: [] },
    { events: [makeGroupEventSummary({ starts_at_ms: Date.parse("2026-04-08T00:00:00.000Z") })] },
  ])(
    "returns empty history when there are no past events (%#)",
    async ({ events }) => {
      (db.events.select.byGroupId as jest.Mock).mockResolvedValue(events);
      await expect(service.query.pastEvents("group-1")).resolves.toEqual([]);
    },
  );
});

