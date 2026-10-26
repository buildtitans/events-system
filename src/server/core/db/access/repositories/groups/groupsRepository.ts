import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import {
  GroupsSelector,
  IGroupsSelector,
} from "./handlers/select/groupsSelector";
import {
  GroupsWriter,
  IGroupsWriter,
} from "@/src/server/core/db/access/repositories/groups/handlers/write/groupsWriter";
import { GroupsValidator } from "./handlers/validate/groupsValidator";
import { IGroupsReader, GroupsReader } from "./handlers/read/groupsReader";
import { EventsValidator } from "@/src/server/core/db/access/repositories/events/handlers/validate/eventsValidator";
import { GroupsParser } from "./handlers/parse/groupsParser";

export interface IGroupsRepository {
  readonly select: IGroupsSelector;
  readonly write: IGroupsWriter;
}

export class GroupsRepository implements IGroupsRepository {
  public readonly select: IGroupsSelector;
  public readonly write: IGroupsWriter;
  private readonly validator: GroupsValidator;
  private readonly read: IGroupsReader;
  constructor(private readonly db: Kysely<DB>) {
    this.validator = new GroupsValidator(new EventsValidator());
    this.read = new GroupsReader(this.db, new GroupsParser());
    this.select = new GroupsSelector(this.read, this.validator);
    this.write = new GroupsWriter(this.db, this.validator);
  }
}
