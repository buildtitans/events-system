import { Kysely } from "kysely";
import { DB, Groups } from "@/src/server/core/db/types/db";
import type { Selectable, Insertable } from "kysely";
import type {
  GroupSchemaType,
  NewGroupInputSchemaType,
} from "@/src/schemas/groups/groupSchema";
import { slugify } from "@/src/server/core/lib/utils/slugify";
import { GroupsValidator } from "./groupsValidator";

export interface IGroupsWriter {
  createGroup(
    newGroup: NewGroupInputSchemaType,
    organizer_id: string,
  ): Promise<GroupSchemaType>;
}

export class GroupsWriter implements IGroupsWriter {
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
