import { Kysely } from "kysely";
import type { DB } from "../../../types/db";
import { GroupMembersValidator } from "./groupMembersValidator";
import { GroupMembersSelector } from "./groupMembersSelector";
import { GroupMembersWriter } from "./groupMembersWriter";

export class GroupMembersRepository {
  public readonly select: GroupMembersSelector;
  public readonly write: GroupMembersWriter;
  private readonly validator: GroupMembersValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.validator = new GroupMembersValidator();
    this.select = new GroupMembersSelector(this.db, this.validator);
    this.write = new GroupMembersWriter(this.db, this.validator);
  }
}
