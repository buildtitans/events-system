import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import {
  GroupsSelector,
  IGroupsSelector,
} from "@/src/server/core/db/access/repositories/groups/groupsSelector";
import {
  GroupsWriter,
  IGroupsWriter,
} from "@/src/server/core/db/access/repositories/groups/groupsWriter";
import { GroupsValidator } from "@/src/server/core/db/access/repositories/groups/groupsValidator";
import { RawGroupsReader } from "./rawGroupsReader";

export interface IGroupsRepository {
  readonly select: IGroupsSelector;
  readonly write: IGroupsWriter;
}

export class GroupsRepository implements IGroupsRepository {
  public readonly select: IGroupsSelector;
  public readonly write: IGroupsWriter;
  private readonly validator: GroupsValidator;
  private readonly read: RawGroupsReader;
  constructor(private readonly db: Kysely<DB>) {
    this.validator = new GroupsValidator();
    this.read = new RawGroupsReader(this.db);
    this.select = new GroupsSelector(this.read, this.validator);
    this.write = new GroupsWriter(this.db, this.validator);
  }
}
