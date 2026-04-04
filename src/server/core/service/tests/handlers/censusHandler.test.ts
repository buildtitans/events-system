import { CensusHandler } from "@/src/server/core/service/handlers/censusHandler";
import { dbMock, makeAttendanceUpdate } from "../mockers/mocks";

describe("CensusHandler.getNumberOfAttendantsForEvent", () => {
  const getAttendantsInDb = dbMock.eventAttendants.getAttendants as jest.Mock;

  let handler: CensusHandler;

  beforeEach(() => {
    (jest.resetAllMocks(), (handler = new CensusHandler(dbMock)));
  });

  const attendants = [
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-1" }, "interested"),
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
    makeAttendanceUpdate({ event_id: "event-1" }, "interested"),
    makeAttendanceUpdate({ event_id: "event-1" }, "interested"),
    makeAttendanceUpdate({ event_id: "event-1" }, "going"),
  ];

  const numberGoing = attendants.filter((att) => att.status === "going");
  const numberInterested = attendants.filter(
    (att) => att.status === "interested",
  );

  it("Returns the number of attending members, and interested members or the event", async () => {
    getAttendantsInDb.mockResolvedValue(attendants);

    await expect(
      handler.getNumberOfAttendantsForEvent("event-1"),
    ).resolves.toMatchObject({
      numGoing: numberGoing.length,
      numInterested: numberInterested.length,
    });
  });
});
