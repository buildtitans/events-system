import {
  EventSearchResultSchemaType,
  EventSearchSuggestionSchemaType,
} from "../../../../../../schemas/search/searchSchema";
import {
  EventById,
  EventForDiscovery,
  RawDiscoverableEvent,
  RawGroupEvent,
  RawHydratedEvent,
  RawNextEvent,
  RawReadHydratedEvent,
  ReadEventById,
  ReadGroupEvent,
  ReadNextEvent,
  ReadSearchResult,
  ReadSuggestedEvent,
} from "./types";

export interface IEventsParser {
  toHydratedEvent(result: RawReadHydratedEvent): RawHydratedEvent;
  toDiscoverableEvents(results: EventForDiscovery[]): RawDiscoverableEvent[];
  toGroupEvents(results: ReadGroupEvent[]): RawGroupEvent[];
  toNextEvent(result: ReadNextEvent): RawNextEvent | undefined;
  toEventsByIds(results: ReadEventById[]): EventById[];
  toSuggestions(rows: ReadSuggestedEvent[]): EventSearchSuggestionSchemaType[];
  toSearchResults(rows: ReadSearchResult[]): EventSearchResultSchemaType[];
}

export class EventsParser implements IEventsParser {
  public toHydratedEvent(result: RawReadHydratedEvent): RawHydratedEvent {
    const { group_name, group_slug, going, interested, ...event } = result;

    return {
      event: {
        ...event,
        starts_at: event.starts_at.toISOString(),
        starts_at_ms: event.starts_at.getTime(),
        created_at: event.created_at.toISOString(),
        updated_at: event.updated_at?.toISOString() ?? null,
      },
      meta: {
        group_name,
        group_slug,
        attendants: {
          going: Number(going),
          interested: Number(interested),
        },
      },
    };
  }

  public toSearchResults(
    rows: ReadSearchResult[],
  ): EventSearchResultSchemaType[] {
    return rows.map(
      ({
        starts_at,
        group_name,
        group_location,
        group_slug,
        going,
        interested,
        timeline_status,
        event_phase,
        ...event
      }) => {
        const data = {
          event: { ...event, starts_at: starts_at.toISOString() },
          meta: {
            label: event.title,
            group: { group_name, group_location, group_slug },
            attendance: {
              going: Number(going),
              interested: Number(interested),
            },
          },
        };
        return timeline_status === "today"
          ? { kind: "event", timeline_status, event_phase, data }
          : { kind: "event", timeline_status, data };
      },
    );
  }

  public toSuggestions(
    rows: ReadSuggestedEvent[],
  ): EventSearchSuggestionSchemaType[] {
    return rows.map(
      ({ starts_at, group_name, group_location, group_slug, ...event }) => ({
        kind: "event",
        data: {
          event: { ...event, starts_at_ms: starts_at.getTime() },
          meta: {
            label: event.title,
            group: { group_name, group_location, group_slug },
          },
        },
      }),
    );
  }

  public toEventsByIds(results: ReadEventById[]): EventById[] {
    return results.map((event) => {
      const {
        going_count,
        interested_count,
        group_name,
        category_name,
        group_location,
        starts_at,
        ...rest
      } = event;
      return {
        event: {
          ...rest,
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
        },
        meta: {
          attendance: {
            going: Number(going_count),
            interested: Number(interested_count),
          },
          group_name,
          group_location: group_location ?? "Online",
          category_name,
        },
      };
    });
  }

  public toNextEvent(result: ReadNextEvent): RawNextEvent | undefined {
    if (result) {
      const { category_name, going, interested, starts_at, ...rest } = result;

      return {
        event: {
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
          ...rest,
        },
        meta: {
          attendance: {
            going: Number(going),
            interested: Number(interested),
          },
          category_name,
        },
      };
    }
  }

  public toDiscoverableEvents(
    results: EventForDiscovery[],
  ): RawDiscoverableEvent[] {
    return results.map((event) => {
      const {
        going_count,
        interested_count,
        group_name,
        group_location,
        starts_at,
        category_name,
        ...rest
      } = event;
      return {
        event: {
          ...rest,
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
        },
        meta: {
          category_name: category_name ?? undefined,
          attendance: {
            going: Number(going_count),
            interested: Number(interested_count),
          },
          group_name,
          group_location: group_location ?? "Online",
        },
      };
    });
  }

  public toGroupEvents(results: ReadGroupEvent[]): RawGroupEvent[] {
    return results.map((event) => {
      const {
        going_count,
        interested_count,
        starts_at,
        category_name,
        ...rest
      } = event;
      return {
        event: {
          ...rest,
          starts_at: starts_at.toISOString(),
          starts_at_ms: starts_at.getTime(),
        },
        meta: {
          category_name: category_name ?? undefined,
          attendance: {
            going: Number(going_count),
            interested: Number(interested_count),
          },
        },
      };
    });
  }
}
