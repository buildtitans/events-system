import type { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";
import type {
  SuggestionOptions,
  SuggestionType,
} from "@/src/lib/store/slices/search/types";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";

export function compileSearchOptions(
  events: EventsArraySchemaType,
  groups: GroupsSchemaType,
): SuggestionOptions {
  let options: SuggestionType[] = [];

  const eventSuggestions = mapEventSuggestions(events);
  const groupSuggestions = mapGroupSuggestions(groups);

  options = [...eventSuggestions, ...groupSuggestions];

  return options;
}

function mapEventSuggestions(events: EventsArraySchemaType): SuggestionOptions {
  const arr: SuggestionOptions = [];

  for (const event of events) {
    arr.push({
      kind: "event",
      label: event.title,
      event_id: event.id,
      group_id: event.group_id,
    });
  }

  return arr;
}

function mapGroupSuggestions(groups: GroupsSchemaType): SuggestionOptions {
  const arr: SuggestionOptions = [];

  console.log({ "Groups Passed": groups });

  for (const group of groups) {
    arr.push({
      kind: "group",
      label: group.name,
      group_id: group.id,
    });
  }

  return arr;
}
