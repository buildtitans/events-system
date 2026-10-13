import { validateOrThrow } from "@/src/schemas/validateOrThrow";
import {
  GroupSchema,
  GroupsSchema,
  type GroupSchemaType,
  type GroupsSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { Selectable } from "kysely";
import type { Groups } from "@/src/server/core/db/types/db";

export class GroupsValidator {
  groups(groups: Selectable<Groups>[]): GroupsSchemaType {
    const formatted = [];

    for (const group of groups) {
      const parsed = this.toGroupSchema(group);
      formatted.push(parsed);
    }

    const validGroups = validateOrThrow(GroupsSchema, formatted);
    return validGroups;
  }

  group(group: Selectable<Groups>): GroupSchemaType {
    const raw = this.toGroupSchema(group);
    return validateOrThrow(GroupSchema, raw);
  }

  private toGroupSchema(group: Selectable<Groups>): GroupSchemaType {
    return {
      id: group.id,
      name: group.name,
      slug: group.slug,
      description: group.description,
      location: group.location,
      category_id: group.category_id,
      organizer_id: group.organizer_id,
      created_at: group.created_at.toISOString(),
      updated_at: group.updated_at.toISOString(),
    };
  }
}
