import { Kysely } from "kysely";
import { DB } from "@/src/server/core/db/types/db";
import { GroupsSelector } from "@/src/server/core/db/access/repositories/groups/groupsSelector";
import { GroupsWriter } from "@/src/server/core/db/access/repositories/groups/groupsWriter";
import { GroupsValidator } from "@/src/server/core/db/access/repositories/groups/groupsValidator";

export class GroupsRepository {
  public readonly select: GroupsSelector;
  public readonly write: GroupsWriter;
  private readonly validator: GroupsValidator;
  constructor(private readonly db: Kysely<DB>) {
    this.validator = new GroupsValidator();
    this.select = new GroupsSelector(this.db, this.validator);
    this.write = new GroupsWriter(this.db, this.validator);
  }
}
