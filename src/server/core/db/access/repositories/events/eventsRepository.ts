import type { Kysely } from "kysely";
import type { DB } from "@/src/server/core/db/types/db";
import {
  EventsSelector,
  IEventsSelector,
} from "./handlers/select/eventsSelector";
import { EventsValidator, IEventsValidator } from "@/src/server/core/db/access/repositories/events/handlers/validate/eventsValidator";
import { EventsWriter, IEventsWriter } from "@/src/server/core/db/access/repositories/events/handlers/write/eventsWriter";
import { EventsReader, IEventsReader } from "@/src/server/core/db/access/repositories/events/handlers/read/eventsReader";
import { EventsParser } from "@/src/server/core/db/access/repositories/events/handlers/parse/eventsParser";

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
