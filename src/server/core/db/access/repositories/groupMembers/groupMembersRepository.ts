import { Kysely } from "kysely";
import type { DB } from "../../../types/db";
import { GroupMembersValidator } from "./groupMembersValidator";
import { GroupMembersSelector } from "./groupMembersSelector";
import { GroupMembersWriter } from "./groupMembersWriter";
import { RawGroupMembersReader } from "./rawGroupMembersReader";

export class GroupMembersRepository {
  public readonly select: GroupMembersSelector;
  public readonly write: GroupMembersWriter;
  private readonly read: RawGroupMembersReader;
  private readonly validator: GroupMembersValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.validator = new GroupMembersValidator();
    this.read = new RawGroupMembersReader(this.db);
    this.select = new GroupMembersSelector(this.read, this.validator);
    this.write = new GroupMembersWriter(this.db, this.validator);
  }
}
