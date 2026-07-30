import { Authorization } from "../auth/authorization";
import { EventHydrationHandler } from "../handlers/events/eventHydrationHandler";
import { EventLayoutComposer } from "../handlers/events/eventLayoutComposer";
import { EventTimelineHandler } from "../handlers/events/eventTimelineHandler";
import { EventQueryHandler } from "../handlers/events/eventQueryHandler";
import { EventLifecycleHandler } from "../handlers/events/eventLifecycleHandler";
import { EventLayoutHandler } from "../handlers/events/eventLayoutHandler";
import {
  IEventHydrationHandler,
  IEventLayoutHandler,
  IEventLifecycleHandler,
  IEventQueryHandler,
  IEventTimelineHandler,
} from "../handlers/events/types";
import { EventServiceDB, IEventService } from "./types";

export class EventService implements IEventService {
  public readonly hydrate: IEventHydrationHandler;
  public readonly query: IEventQueryHandler;
  public readonly timeline: IEventTimelineHandler;
  public readonly layout: IEventLayoutHandler;
  public readonly lifecycle: IEventLifecycleHandler;
  constructor(
    private readonly db: EventServiceDB,
    private readonly policy: Authorization,
  ) {
    this.hydrate = new EventHydrationHandler(this.db);
    this.timeline = new EventTimelineHandler(this.db, this.policy);
    this.layout = new EventLayoutHandler(this.db, new EventLayoutComposer());
    this.query = new EventQueryHandler(this.db);
    this.lifecycle = new EventLifecycleHandler(this.db, this.policy);
  }
}
