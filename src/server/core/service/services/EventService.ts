import { DBClient } from "../../db";
import { Authorization } from "../auth/authorization";
import { EventHydrationHandler } from "../handlers/eventHydrationHandler";
import { EventLayoutComposer } from "../handlers/eventLayoutComposer";
import { EventTimelineHandler } from "../handlers/eventTimelineHandler";
import { EventQueryHandler } from "../handlers/eventQueryHandler";
import { EventLifecycleHandler } from "../handlers/eventLifecycleHandler";
import { EventLayoutHandler } from "../handlers/eventLayoutHandler";

export class EventService {
  public readonly hydrate: EventHydrationHandler;
  public readonly query: EventQueryHandler;
  public readonly timeline: EventTimelineHandler;
  public readonly layout: EventLayoutHandler;
  public readonly lifecycle: EventLifecycleHandler;
  private readonly composer: EventLayoutComposer;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.composer = new EventLayoutComposer();
    this.hydrate = new EventHydrationHandler(this.db);
    this.timeline = new EventTimelineHandler(this.db, this.policy);
    this.layout = new EventLayoutHandler(this.db, this.composer);
    this.query = new EventQueryHandler(this.db);
    this.lifecycle = new EventLifecycleHandler(this.db, this.policy);
  }
}
