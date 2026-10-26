import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { EventAttendantsValidator } from "./handlers/validate/eventAttendantsValidator";
import { EventAttendantsReader } from "./handlers/select/eventAttendantsReader";
import {
  EventAttendantsSelector,
  IEventAttendantsSelector,
} from "./handlers/select/eventAttendantsSelector";
import {
  EventAttendantsWriter,
  IEventAttendantsWriter,
} from "./handlers/write/eventAttendantsWriter";
import { IEventAttendantsReader } from "./types";
import {
  EventAttendantsParser,
  IEventAttendantsParser,
} from "./handlers/parse/eventAttendantsParser";

export interface IEventAttendantsRepository {
  readonly select: IEventAttendantsSelector;
  readonly write: IEventAttendantsWriter;
}

export class EventAttendantsRepository implements IEventAttendantsRepository {
  public readonly select: IEventAttendantsSelector;
  public readonly write: IEventAttendantsWriter;
  private readonly validator: EventAttendantsValidator;
  private readonly read: IEventAttendantsReader;
  private readonly parse: IEventAttendantsParser;
  constructor(private readonly db: Kysely<DB>) {
    this.parse = new EventAttendantsParser();
    this.validator = new EventAttendantsValidator();
    this.read = new EventAttendantsReader(this.db, this.parse);
    this.select = new EventAttendantsSelector(this.validator, this.read);
    this.write = new EventAttendantsWriter(this.validator, this.db, this.parse);
  }
}
