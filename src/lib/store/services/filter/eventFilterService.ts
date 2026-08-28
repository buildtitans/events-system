import type { TrpcClientType } from "@/src/trpc/trpcClient";
import { EventsPages } from "@/src/lib/store/slices/events/types";
import { logCaughtError } from "@/src/lib/utils/errors/logCaughtError";

interface IEventFilterService {
  all(): Promise<FilterResults>;
  popular(): Promise<FilterResults>;
  upcoming(): Promise<FilterResults>;
}

export type FilterResults =
  | { events: EventsPages; ok: true }
  | { ok: false; error: string };

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
      const events = await this.trpc.events.layout.popular.query();

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
      const events = await this.trpc.events.layout.upcoming.query();

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
}
