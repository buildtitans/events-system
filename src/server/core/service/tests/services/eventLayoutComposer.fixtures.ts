import { makeEvent } from "@/src/server/core/service/tests/mockers/mocks";

export const sixEvents = Array.from({ length: 6 }, (_, index) =>
  makeEvent({
    id: `event-${index + 1}`,
    title: `Event ${index + 1}`,
  }),
);

export const sevenEvents = Array.from({ length: 7 }, (_, index) =>
  makeEvent({
    id: `event-${index + 1}`,
    title: `Event ${index + 1}`,
  }),
);

export const fullPage = [
  [
    {
      kind: "card" as const,
      variant: {
        type: "hero" as const,
        size: { xs: 12 as const, md: 6 as const },
      },
      event: sixEvents[0],
    },
    {
      kind: "card" as const,
      variant: {
        type: "hero" as const,
        size: { xs: 12 as const, md: 6 as const },
      },
      event: sixEvents[1],
    },
    {
      kind: "card" as const,
      variant: {
        type: "thumbnail" as const,
        size: { xs: 12 as const, md: 4 as const },
      },
      event: sixEvents[2],
    },
    {
      kind: "stack" as const,
      events: [sixEvents[3], sixEvents[4]],
    },
    {
      kind: "card" as const,
      variant: {
        type: "thumbnail" as const,
        size: { xs: 12 as const, md: 4 as const },
      },
      event: sixEvents[5],
    },
  ],
];

export const multiplePages = [
  [
    {
      kind: "card" as const,
      variant: {
        type: "hero" as const,
        size: { xs: 12 as const, md: 6 as const },
      },
      event: sevenEvents[0],
    },
    {
      kind: "card" as const,
      variant: {
        type: "hero" as const,
        size: { xs: 12 as const, md: 6 as const },
      },
      event: sevenEvents[1],
    },
    {
      kind: "card" as const,
      variant: {
        type: "thumbnail" as const,
        size: { xs: 12 as const, md: 4 as const },
      },
      event: sevenEvents[2],
    },
    {
      kind: "stack" as const,
      events: [sevenEvents[3], sevenEvents[4]],
    },
    {
      kind: "card" as const,
      variant: {
        type: "thumbnail" as const,
        size: { xs: 12 as const, md: 4 as const },
      },
      event: sevenEvents[5],
    },
  ],
  [
    {
      kind: "card" as const,
      variant: {
        type: "hero" as const,
        size: { xs: 12 as const, md: 6 as const },
      },
      event: sevenEvents[6],
    },
  ],
];
