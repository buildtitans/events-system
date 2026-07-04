import { Kysely } from "kysely";
import { DB, Groups } from "../../../types/db";
import { GroupsValidator } from "./groupsValidator";
import type { Selectable, Insertable } from "kysely";
import type {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "../../../../../../schemas/groups/groupSchema";
import { slugify } from "../../../../lib/utils/slugify";

export class GroupsWriter {
  constructor(
    private readonly db: Kysely<DB>,
    private readonly validator: GroupsValidator,
  ) {}

  async createGroup(
    newGroup: NewGroupInputSchemaType,
    organizer_id: string,
  ): Promise<GroupSchemaType> {
    const insertableGroup = this.parseNewGroup(newGroup, organizer_id);
    const inserted = await this.insertNewGroup(insertableGroup);
    return this.validator.group(inserted);
  }

  private async insertNewGroup(
    newGroup: Insertable<Groups>,
  ): Promise<Selectable<Groups>> {
    return this.db
      .insertInto("groups")
      .values(newGroup)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  private parseNewGroup(
    newGroup: NewGroupInputSchemaType,
    organizer_id: string,
  ): Insertable<Groups> {
    return {
      name: newGroup.name,
      slug: slugify(newGroup.name),
      description: newGroup.description,
      location: newGroup.location,
      category_id: newGroup.category_id ?? "",
      organizer_id: organizer_id,
    };
  }
}
