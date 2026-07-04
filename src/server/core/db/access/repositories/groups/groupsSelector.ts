import { Kysely } from "kysely";
import { DB } from "../../../types/db";
import { GroupsValidator } from "./groupsValidator";
import { RawGroupsReader } from "./rawGroupsReader";
import { GroupSchemaType } from "../../../../../../schemas/groups/groupSchema";

export class GroupsSelector {
  protected readonly read: RawGroupsReader;
  constructor(
    private readonly db: Kysely<DB>,
    private readonly validator: GroupsValidator,
  ) {
    this.read = new RawGroupsReader(this.db);
    this.validator = new GroupsValidator();
  }

  async all(): Promise<GroupSchemaType[]> {
    const raw = await this.db.selectFrom("groups").selectAll().execute();
    return this.validator.groups(raw);
  }

  async byId(id: GroupSchemaType["id"]): Promise<GroupSchemaType> {
    const raw = await this.read.rawById(id);
    return this.validator.group(raw);
  }

  async byIds(ids: GroupSchemaType["id"][]): Promise<GroupSchemaType[]> {
    const raw = await this.read.rawByIds(ids);
    return this.validator.groups(raw);
  }

  async bySlug(slug: GroupSchemaType["slug"]): Promise<GroupSchemaType> {
    const raw = await this.read.rawBySlug(slug);
    return this.validator.group(raw);
  }

  async byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupSchemaType[]> {
    const raw = await this.read.rawByOrganizerId(organizer_id);
    return this.validator.groups(raw);
  }

  async search(query: string): Promise<GroupSchemaType[]> {
    const raw = await this.read.byName(query);
    return this.validator.groups(raw);
  }
}
