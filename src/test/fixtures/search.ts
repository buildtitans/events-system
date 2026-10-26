import type { EventSearchResultSchemaType, GroupSearchResultSchemaType, EventSearchSuggestionSchemaType, GroupSearchSuggestionSchemaType } from "@/src/schemas/search/searchSchema";

export const makeEventResult = (title = "React Night", id = "event-1"): EventSearchResultSchemaType => ({
  kind: "event", timeline_status: "upcoming",
  data: { event: { id, title, group_id: "group-1", description: "A meetup", img: "event.png", tag: null, starts_at: "2030-01-01T18:00:00.000Z" },
    meta: { label: title, group: { group_name: "React Community", group_slug: "react-community", group_location: "Chicago" }, attendance: { going: 0, interested: 0 } } },
});
export const makeGroupResult = (name = "React", id = "group-1"): GroupSearchResultSchemaType => ({
  kind: "group", data: { group: { id, name, slug: "react-community", description: null, location: "Chicago" }, meta: { label: name, category_name: "Technology", member_count: 1 } },
});
export const makeEventSuggestion = (): EventSearchSuggestionSchemaType => ({
  kind: "event", data: { event: { id: "event-1", group_id: "group-1", title: "React Night", starts_at_ms: 1893520800000 }, meta: { label: "React Night", group: { group_name: "React Community", group_slug: "react-community", group_location: "Chicago" } } },
});
export const makeGroupSuggestion = (): GroupSearchSuggestionSchemaType => ({
  kind: "group", data: { group: makeGroupResult().data.group, meta: { label: "React", group: { category_name: "Technology", member_count: 1 } } },
});
