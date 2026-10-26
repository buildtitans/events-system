import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";
import { EventAttendantsWriter } from "./eventAttendantsWriter";
import { EventAttendantsParser } from "../parse/eventAttendantsParser";
import { EventAttendantsValidator } from "../validate/eventAttendantsValidator";

describe("EventAttendantsWriter.rsvp", () => {
  it.each([null, new Date("2030-01-02T12:00:00Z")])(
    "normalizes dates and string counts before validating the response (%s)",
    async (updated_at) => {
      const event_id = "00000000-0000-4000-8000-000000000001";
      const user_id =
        "00000000-0000-4000-8000-000000000002" as AuthenticatedUserId;
      const created_at = new Date("2030-01-01T12:00:00Z");
      const write = {
        values: jest.fn().mockReturnThis(),
        onConflict: jest.fn().mockReturnThis(),
        returningAll: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest.fn().mockResolvedValue({
          event_id,
          user_id,
          status: "going",
          created_at,
          updated_at,
        }),
      };
      const read = {
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        executeTakeFirstOrThrow: jest
          .fn()
          .mockResolvedValue({ going: "0", interested: "2" }),
      };
      const db = {
        insertInto: jest.fn().mockReturnValue(write),
        selectFrom: jest.fn().mockReturnValue(read),
      } as unknown as Kysely<DB>;
      const result = await new EventAttendantsWriter(
        new EventAttendantsValidator(),
        db,
        new EventAttendantsParser(),
      ).rsvp({ event_id, user_id }, "going");
      expect(result).toEqual({
        updated: {
          event_id,
          user_id,
          status: "going",
          created_at: created_at.toISOString(),
          updated_at: updated_at?.toISOString() ?? null,
        },
        headCount: { going: 0, interested: 2 },
      });
      expect(read.where).toHaveBeenCalledWith("event_id", "=", event_id);
    },
  );
});
