import type { Kysely } from "kysely";
import type { DB } from "../../../types/db";
import { EventsSelector } from "./eventsSelector";
import { EventsValidator } from "./eventsValidator";
import { EventsWriter } from "./eventsWriter";
import { RawEventsReader } from "./rawEventsReader";

export class EventsRepository {
  public readonly select: EventsSelector;
  public readonly write: EventsWriter;
  private readonly read: RawEventsReader;
  private readonly validate: EventsValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.validate = new EventsValidator();
    this.read = new RawEventsReader(this.db);
    this.select = new EventsSelector(this.validate, this.read);
    this.write = new EventsWriter(this.db, this.validate);
  }
}
