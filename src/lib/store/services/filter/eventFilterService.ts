import type { TrpcClientType } from "@/src/trpc/trpcClient";
import { EventsPages } from "@/src/lib/store/slices/events/types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";

interface IEventFilterService {
  all(): Promise<FilterResults>;
  popular(): Promise<FilterResults>;
  upcoming(): Promise<FilterResults>;
}

export type FilterResults =
  | { events: EventsPages; ok: true }
  | { ok: false; error: string };

const WINDOW = 30 * 24 * 60 * 60 * 1000;

export class EventFilterService implements IEventFilterService {
  constructor(private readonly trpc: TrpcClientType) {}

  async all(): Promise<FilterResults> {
    try {
      const events = await this.trpc.events.layout.allActive.query();

      return {
        ok: true,
        events,
      };
    } catch (err) {
      logCaughtError("useChangeActiveCategory.getAllActiveEvents()", err);
      return {
        ok: false,
        error: "Failed to retrieve all active events layout",
      };
    }
  }

  async popular(): Promise<FilterResults> {
    try {
      const ids = await this.trpc.eventAttendants.select.popular.query();
      const events = await this.trpc.events.layout.byIds.query(ids);

      return {
        ok: true,
        events,
      };
    } catch (err) {
      logCaughtError("EventFilterService.popular()", err);
      return {
        ok: false,
        error: "Failed to retrieve popular events layout",
      };
    }
  }

  async upcoming(): Promise<FilterResults> {
    try {
      const allEvents = await this.trpc.events.select.all.query();
      const ids = this.extractUpcoming(allEvents);
      const events = await this.trpc.events.layout.byIds.query(ids);

      return {
        ok: true,
        events,
      };
    } catch (err) {
      logCaughtError("EventFilterService.popular()", err);
      return {
        ok: false,
        error: "Failed to retrive upcoming events layout",
      };
    }
  }

  private extractUpcoming(events: EventSchemaType[]) {
    const results: EventSchemaType["id"][] = [];
    const nowMs = Date.now();

    for (const event of events) {
      const upcomingEvent = this.isUpcoming(event, nowMs);
      if (upcomingEvent) {
        results.push(event.id);
      }
    }
    return results;
  }

  private isUpcoming(event: EventSchemaType, nowMs: number): boolean {
    const windowEndMs = nowMs + WINDOW;
    const starts_at_ms = event.starts_at_ms;
    return starts_at_ms >= nowMs && starts_at_ms <= windowEndMs;
  }
}
