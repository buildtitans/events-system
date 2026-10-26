import { IEventsValidator } from "@/src/server/core/db/access/repositories/events/handlers/validate/eventsValidator";
import { IEventsReader } from "@/src/server/core/db/access/repositories/events/handlers/read/eventsReader";
import {
  EventViewSelector,
  IEventViewSelector,
} from "./eventHydrationSelector";
import { EventQuerySelector, IEventQuerySelector } from "./eventQuerySelector";

export interface IEventsSelector {
  readonly view: IEventViewSelector;
  readonly query: IEventQuerySelector;
}

export class EventsSelector implements IEventsSelector {
  public readonly view: IEventViewSelector;
  public readonly query: IEventQuerySelector;
  constructor(
    private readonly validate: IEventsValidator,
    private readonly read: IEventsReader,
  ) {
    this.view = new EventViewSelector(this.validate, this.read.hydrate);
    this.query = new EventQuerySelector(this.read.query, this.validate);
  }
}
