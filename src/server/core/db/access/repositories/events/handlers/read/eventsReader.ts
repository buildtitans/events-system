import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { IEventsParser } from "@/src/server/core/db/access/repositories/events/handlers/parse/eventsParser";
import {
  EventHydrationReader,
  IEventHydrationReader,
} from "@/src/server/core/db/access/repositories/events/handlers/read/eventHydrationReader";
import {
  EventQueryReader,
  IEventQueryReader,
} from "@/src/server/core/db/access/repositories/events/handlers/read/eventQueryReader";

export interface IEventsReader {
  readonly hydrate: IEventHydrationReader;
  readonly query: IEventQueryReader;
}

export class EventsReader implements IEventsReader {
  public readonly hydrate: IEventHydrationReader;
  public readonly query: IEventQueryReader;
  constructor(
    private readonly db: Kysely<DB>,
    private readonly parser: IEventsParser,
  ) {
    this.hydrate = new EventHydrationReader(this.db, this.parser);
    this.query = new EventQueryReader(this.db, this.parser);
  }
}
