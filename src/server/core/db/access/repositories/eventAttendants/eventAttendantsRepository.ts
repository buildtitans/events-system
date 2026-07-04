import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { EventAttendantsValidator } from "./eventAttendantsValidator";
import { EventAttendantsReader } from "./eventAttendantsReader";
import { EventAttendantsSelector } from "./eventAttendantsSelector";
import { EventAttendantsWriter } from "./eventAttendantsWriter";

export class EventAttendantsRepository {
  private readonly validator: EventAttendantsValidator;
  private readonly read: EventAttendantsReader;
  public readonly select: EventAttendantsSelector;
  public readonly write: EventAttendantsWriter;
  constructor(private readonly db: Kysely<DB>) {
    this.validator = new EventAttendantsValidator();
    this.read = new EventAttendantsReader(this.db);
    this.select = new EventAttendantsSelector(this.validator, this.read);
    this.write = new EventAttendantsWriter(this.validator, this.db);
  }
}
