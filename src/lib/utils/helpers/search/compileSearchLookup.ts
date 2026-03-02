import type { EventsArraySchemaType } from "@/src/schemas/events/eventSchema";
import type {
  SuggestionOptions,
  SuggestionType,
  GroupSlugsByIds,
} from "@/src/lib/store/slices/search/types";
import { GroupsSchemaType } from "@/src/schemas/groups/groupSchema";

export function compileSearchOptions(
  events: EventsArraySchemaType,
  groups: GroupsSchemaType,
  storedGroups: GroupsSchemaType,
): SuggestionOptions {
  let options: SuggestionType[] = [];

  const slugsByIds = mapSlugsByGroupIds(storedGroups);
  const groupSuggestions = mapGroupSuggestions(groups);
  const eventSuggestions = mapEventSuggestions(events, slugsByIds);

  options = [...eventSuggestions, ...groupSuggestions];
  return options;
}

function mapEventSuggestions(
  events: EventsArraySchemaType,
  slugsByIds: GroupSlugsByIds,
): SuggestionOptions {
  const arr: SuggestionOptions = [];

  for (const event of events) {
    const groupSlug = slugsByIds[event.group_id];

    const itemLabel = `Event: \n ${event.title}`;

    arr.push({
      kind: "event",
      label: itemLabel,
      event_id: event.id,
      group_id: event.group_id,
      slug: groupSlug,
    });
  }

  return arr;
}

function mapGroupSuggestions(groups: GroupsSchemaType): SuggestionOptions {
  const arr: SuggestionOptions = [];

  for (const group of groups) {
    const itemLabel = `Group: \n ${group.name}`;

    arr.push({
      kind: "group",
      label: itemLabel,
      group_id: group.id,
      slug: group.slug,
    });
  }
  return arr;
}

function mapSlugsByGroupIds(storedGroups: GroupsSchemaType): GroupSlugsByIds {
  const slugHash: GroupSlugsByIds = {};
  for (const group of storedGroups) {
    slugHash[group.id] = group.slug;
  }
  return slugHash;
}
