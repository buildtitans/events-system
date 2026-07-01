import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";
import { EventHydrationHandler } from "../handlers/events/eventHydrationHandler";
import { EventLayoutComposer } from "../handlers/events/eventLayoutComposer";
import { EventTimelineHandler } from "../handlers/events/eventTimelineHandler";
import { EventQueryHandler } from "../handlers/events/eventQueryHandler";
import { EventLifecycleHandler } from "../handlers/events/eventLifecycleHandler";
import { EventLayoutHandler } from "../handlers/events/eventLayoutHandler";

export class EventService {
  public readonly hydrate: EventHydrationHandler;
  public readonly query: EventQueryHandler;
  public readonly timeline: EventTimelineHandler;
  public readonly layout: EventLayoutHandler;
  public readonly lifecycle: EventLifecycleHandler;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.hydrate = new EventHydrationHandler(this.db);
    this.timeline = new EventTimelineHandler(this.db, this.policy);
    this.layout = new EventLayoutHandler(this.db, new EventLayoutComposer());
    this.query = new EventQueryHandler(this.db);
    this.lifecycle = new EventLifecycleHandler(this.db, this.policy);
  }
}
