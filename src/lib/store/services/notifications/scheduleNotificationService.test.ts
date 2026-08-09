import { ScheduleNotificationService } from "@/src/lib/store/services/notifications/scheduleNotificationService";
import type {
  EventSchemaType,
  UpdateEventArgsSchemaType,
} from "@/src/schemas/events/eventSchema";
import type { GroupSchemaType } from "@/src/schemas/groups/groupSchema";
import type { TrpcClientType } from "@/src/trpc/trpcClient";

const event = {
  id: "event-1",
  group_id: "group-1",
  title: "Community Night",
  starts_at: "2026-08-10T18:00:00.000Z",
} as EventSchemaType;

const updates = (status: UpdateEventArgsSchemaType["status"]) =>
  ({ status }) as UpdateEventArgsSchemaType;

describe("ScheduleNotificationService", () => {
  let mutate: jest.Mock;
  let service: ScheduleNotificationService;

  beforeEach(() => {
    mutate = jest.fn().mockResolvedValue({ ok: true });
    service = new ScheduleNotificationService({
      notifications: { write: { create: { mutate } } },
    } as unknown as TrpcClientType);
  });

  it("creates a low-priority notification for a new event", async () => {
    const group = { name: "Local Developers" } as GroupSchemaType;

    await service.createNewEventNotification(event, group);

    expect(mutate).toHaveBeenCalledWith({
      subject: "Local Developers scheduled a new event",
      priority: "low",
      group_id: "group-1",
      message: expect.stringContaining("New event: Community Night scheduled for"),
    });
  });

  it.each([
    ["cancelled", 'The event: "Community Night" has been cancelled'],
    ["scheduled", 'The event: "Community Night" is back on, set for'],
  ] as const)("creates the expected %s status message", async (status, message) => {
    await service.createScheduleNotification(event, updates(status));

    expect(mutate).toHaveBeenCalledWith({
      priority: "high",
      group_id: "group-1",
      subject: "Event Status Update",
      message: expect.stringContaining(message),
    });
  });
});
