import { Kysely } from "kysely";
import type { DB } from "../../../types/db";
import { GroupMembersValidator } from "./groupMembersValidator";
import {
  GroupMembersSelector,
  IGroupMembersSelector,
} from "./groupMembersSelector";
import { GroupMembersWriter, IGroupMembersWriter } from "./groupMembersWriter";
import { RawGroupMembersReader } from "./rawGroupMembersReader";

export interface IGroupMembersRepository {
  readonly select: IGroupMembersSelector;
  readonly write: IGroupMembersWriter;
}

export class GroupMembersRepository implements IGroupMembersRepository {
  public readonly select: IGroupMembersSelector;
  public readonly write: IGroupMembersWriter;
  private readonly read: RawGroupMembersReader;
  private readonly validator: GroupMembersValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.validator = new GroupMembersValidator();
    this.read = new RawGroupMembersReader(this.db);
    this.select = new GroupMembersSelector(this.read, this.validator);
    this.write = new GroupMembersWriter(this.db, this.validator);
  }
}
