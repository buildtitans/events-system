import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { EventAttendantsValidator } from "./eventAttendantsValidator";
import {
  EventAttendantsReader,
  IEventAttendantsReader,
} from "./eventAttendantsReader";
import {
  EventAttendantsSelector,
  IEventAttendantsSelector,
} from "./eventAttendantsSelector";
import {
  EventAttendantsWriter,
  IEventAttendantsWriter,
} from "./eventAttendantsWriter";

export interface IEventAttendantsRepository {
  readonly select: IEventAttendantsSelector;
  readonly write: IEventAttendantsWriter;
}

export class EventAttendantsRepository implements IEventAttendantsRepository {
  public readonly select: IEventAttendantsSelector;
  public readonly write: IEventAttendantsWriter;
  private readonly validator: EventAttendantsValidator;
  private readonly read: IEventAttendantsReader;

  constructor(private readonly db: Kysely<DB>) {
    this.validator = new EventAttendantsValidator();
    this.read = new EventAttendantsReader(this.db);
    this.select = new EventAttendantsSelector(this.validator, this.read);
    this.write = new EventAttendantsWriter(this.validator, this.db);
  }
}
