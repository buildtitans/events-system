import { Kysely } from "kysely";
import type { DB } from "../../../types/db";
import {
  GroupMembersSelector,
  IGroupMembersSelector,
} from "./handlers/select/groupMembersSelector";
import {
  GroupMembersWriter,
  IGroupMembersWriter,
} from "./handlers/write/groupMembersWriter";
import {
  GroupMembersReader,
  IGroupMembersReader,
} from "./handlers/select/groupMembersReader";
import { GroupMembersValidator } from "./handlers/validate/groupMembersValidator";
import {
  GroupMembersParser,
  IGroupMembersParser,
} from "./handlers/parse/groupMembersParser";

export interface IGroupMembersRepository {
  readonly select: IGroupMembersSelector;
  readonly write: IGroupMembersWriter;
}

export class GroupMembersRepository implements IGroupMembersRepository {
  public readonly select: IGroupMembersSelector;
  public readonly write: IGroupMembersWriter;
  private readonly read: IGroupMembersReader;
  private readonly validator: GroupMembersValidator;
  private readonly parse: IGroupMembersParser;
  constructor(private readonly db: Kysely<DB>) {
    this.validator = new GroupMembersValidator();
    this.parse = new GroupMembersParser();
    this.read = new GroupMembersReader(this.db, this.parse);
    this.select = new GroupMembersSelector(this.read, this.validator);
    this.write = new GroupMembersWriter(this.db, this.validator);
  }
}
