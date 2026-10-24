import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import { EventsSelector, IEventsSelector } from "./eventsSelector";
import { EventsValidator, IEventsValidator } from "./eventsValidator";
import { EventsWriter, IEventsWriter } from "./eventsWriter";
import { EventsReader, IEventsReader } from "./eventsReader";
import { EventsParser } from "./eventsParser";

export interface IEventsRepository {
  readonly select: IEventsSelector;
  readonly write: IEventsWriter;
}

export class EventsRepository implements IEventsRepository {
  public readonly select: IEventsSelector;
  public readonly write: IEventsWriter;
  private readonly read: IEventsReader;
  private readonly validate: IEventsValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.validate = new EventsValidator();
    this.read = new EventsReader(this.db, new EventsParser());
    this.select = new EventsSelector(this.validate, this.read);
    this.write = new EventsWriter(this.db, this.validate);
  }
}
