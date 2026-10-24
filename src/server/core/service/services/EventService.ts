import { IAuthorization } from "../auth/authorization";
import { EventLayoutComposer } from "../handlers/events/eventLayoutComposer";
import { EventQueryHandler } from "../handlers/events/eventQueryHandler";
import { EventLifecycleHandler } from "../handlers/events/eventLifecycleHandler";
import { EventLayoutHandler } from "../handlers/events/eventLayoutHandler";
import {
  IEventLayoutHandler,
  IEventLifecycleHandler,
  IEventQueryHandler,
} from "../handlers/events/types";
import { EventServiceDB, IEventService } from "./types";

export class EventService implements IEventService {
  public readonly query: IEventQueryHandler;
  public readonly layout: IEventLayoutHandler;
  public readonly lifecycle: IEventLifecycleHandler;
  constructor(
    private readonly db: EventServiceDB,
    private readonly policy: IAuthorization,
  ) {
    this.layout = new EventLayoutHandler(this.db, new EventLayoutComposer());
    this.query = new EventQueryHandler(this.db);
    this.lifecycle = new EventLifecycleHandler(this.db, this.policy);
  }
}
