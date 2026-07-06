import type { CurrentDisplay } from "@/src/lib/store/slices/groups/types";

export type FallbackCopyType = {
  eyeBrow: "History" | "Events" | "Archives" | "Overview";
  fallbackTitle:
    | "No group activity"
    | "No events held yet"
    | "No events have been scheduled"
    | "No events archived";
  fallbackDescription:
    | "This group has yet to have any activity. If you want to get in touch with the organizer, their email is listed above."
    | "This group has not hosted any completed events yet, so there is no activity history to show here."
    | "This group has not scheduled any events yet, so there are no events to RSVP to right now."
    | "This group has not cancelled any events yet, so there are no archives to show right now. Whenever you do choose to cancel an event, you can find them here to view or reschedule.";
  fallbackCaption:
    | "If you want to get in touch with the organizer, their email is listed above."
    | "Once an event is past the date scheduled when it was created, you can no longer rescind cancellation.";
};

export const groupFallbackCopy = {
  "group history": {
    eyeBrow: "History",
    fallbackTitle: "No events held yet",
    fallbackDescription:
      "This group has not hosted any completed events yet, so there is no activity history to show here.",
    fallbackCaption:
      "If you want to get in touch with the organizer, their email is listed above.",
  },
  events: {
    eyeBrow: "Events",
    fallbackTitle: "No events have been scheduled",
    fallbackDescription:
      "This group has not scheduled any events yet, so there are no events to RSVP to right now.",
    fallbackCaption:
      "If you want to get in touch with the organizer, their email is listed above.",
  },
  archives: {
    eyeBrow: "Archives",
    fallbackTitle: "No events archived",
    fallbackDescription:
      "This group has not cancelled any events yet, so there are no archives to show right now. Whenever you do choose to cancel an event, you can find them here to view or reschedule.",
    fallbackCaption:
      "Once an event is past the date scheduled when it was created, you can no longer rescind cancellation.",
  },
  overview: {
    eyeBrow: "Overview",
    fallbackTitle: "No group activity",
    fallbackDescription:
      "This group has yet to have any activity. If you want to get in touch with the organizer, their email is listed above.",
    fallbackCaption:
      "If you want to get in touch with the organizer, their email is listed above.",
  },
} as const satisfies Record<CurrentDisplay, FallbackCopyType>;
