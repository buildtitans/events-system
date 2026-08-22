import { NewEventInputSchemaValidator } from "./eventSchema";
import type { NewEventInputSchemaType } from "./eventSchema";

const validEvent = {
  group_id: "8cf76d94-83c9-46de-90ac-fe4047a00000",
  starts_at: "2026-08-22T18:00:00.000Z",
  title: "Community Night",
  description: "An evening event",
  meeting_location: "Online",
  img: "https://picsum.photos/800/450",
  tag: null,
} satisfies NewEventInputSchemaType;

describe("NewEventInputSchema tag", () => {
  it.each([null, "Music", "Live Music", "a".repeat(24)])(
    "accepts %p",
    (tag) => {
      expect(NewEventInputSchemaValidator.Check({ ...validEvent, tag })).toBe(
        true,
      );
    },
  );

  it.each([
    ["an empty string", ""],
    ["whitespace", "   "],
    ["more than two words", "Live Local Music"],
    ["more than 24 characters", "a".repeat(25)],
  ])("rejects %s", (_description, tag) => {
    expect(NewEventInputSchemaValidator.Check({ ...validEvent, tag })).toBe(
      false,
    );
  });
});
