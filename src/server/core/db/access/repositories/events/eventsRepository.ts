import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import { EventsSelector, IEventsSelector } from "./eventsSelector";
import { EventsValidator } from "./eventsValidator";
import { EventsWriter, IEventsWriter } from "./eventsWriter";
import { RawEventsReader } from "./rawEventsReader";

export interface IEventsRepository {
  readonly select: IEventsSelector;
  readonly write: IEventsWriter;
}

export class EventsRepository implements IEventsRepository {
  public readonly select: IEventsSelector;
  public readonly write: IEventsWriter;
  private readonly read: RawEventsReader;
  private readonly validate: EventsValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.validate = new EventsValidator();
    this.read = new RawEventsReader(this.db);
    this.select = new EventsSelector(this.validate, this.read);
    this.write = new EventsWriter(this.db, this.validate);
  }
}
