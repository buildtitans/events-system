import type { EventSchemaType } from "@/src/schemas/events/eventSchema";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export type EventLookupMap = Record<
  EventSchemaType["title"],
  EventSchemaType["id"]
>;

export type SearchResultKind = GroupSchemaType | EventSchemaType;

export type GroupSlugsByIds = Record<
  GroupSchemaType["id"],
  GroupSchemaType["slug"]
>;

export type SearchLookupType =
  | { status: "initial" }
  | { status: "pending" }
  | { status: "ready"; data: EventLookupMap }
  | { status: "failed"; error: string }
  | { status: "n/a"; message: "Couldn't find events lookup for autocomplete" };

export type SuggestionType =
  | {
      kind: "event" | "group";
      label: EventSchemaType["title"] | GroupSchemaType["name"];
      event_id: string;
      group_id: string;
      slug: GroupSchemaType["slug"];
    }
  | {
      kind: "event" | "group";
      label: EventSchemaType["title"] | GroupSchemaType["name"];
      group_id: string;
      slug: GroupSchemaType["slug"];
    };

export type SuggestionOptions = Array<SuggestionType>;

export type GroupSuggestionOptionsAndSlugs = {
  groupSuggestions: SuggestionOptions;
  slugsByIds: GroupSlugsByIds;
};

type AutoCompleteMessageType = "Matched 0 terms" | null;

type AutoCompleteErrormessageType = string | null;

type AutoCompleteStatusType =
  | "initial"
  | "pending"
  | "ready"
  | "n/a"
  | "warning";

export type AutoCompleteOptions = {
  status: AutoCompleteStatusType;
  data: SuggestionOptions;
  message: AutoCompleteMessageType;
  error: AutoCompleteErrormessageType;
};
