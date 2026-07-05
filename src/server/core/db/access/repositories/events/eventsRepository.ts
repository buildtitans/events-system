import type { Kysely } from "kysely";
import type { DB } from "../../../types/db";
import { EventsSelector } from "./eventsSelector";
import { EventsValidator } from "./eventsValidator";
import { EventsWriter } from "./eventsWriter";

export class EventsRepository {
  public readonly select: EventsSelector;
  public readonly write: EventsWriter;
  private readonly validate: EventsValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.validate = new EventsValidator();
    this.select = new EventsSelector(this.db, this.validate);
    this.write = new EventsWriter(this.db, this.validate);
  }
}
