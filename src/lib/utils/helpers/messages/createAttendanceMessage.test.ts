import {
  createArchivedEventHeadcount,
  createAttendanceMessage,
} from "@/src/lib/utils/helpers/messages/createAttendanceMessage";

describe("createAttendanceMessage", () => {
  it("describes when nobody attended", () => {
    expect(createAttendanceMessage(0)).toBe("Nobody attended");
  });

  it("describes a singular attendee", () => {
    expect(createAttendanceMessage(1)).toBe("1 Person attended");
  });

  it("describes multiple attendees", () => {
    expect(createAttendanceMessage(3)).toBe("3 People attended");
  });
});

describe("createArchivedEventHeadcount", () => {
  it("describes when nobody was marked going", () => {
    expect(createArchivedEventHeadcount(0)).toBe("Nobody was marked going");
  });

  it("describes a singular person marked going", () => {
    expect(createArchivedEventHeadcount(1)).toBe("1 Person was going");
  });

  it("describes multiple people marked going", () => {
    expect(createArchivedEventHeadcount(4)).toBe("4 People were going");
  });
});
