import { CategorySchemaType } from "../../../../../../schemas/groups/categoriesSchema";
import { GroupsValidator } from "./groupsValidator";
import { RawGroupsReader } from "./rawGroupsReader";
import { GroupSchemaType } from "@/src/schemas/groups/groupSchema";

export interface IGroupsSelector {
  all(): Promise<GroupSchemaType[]>;
  byId(id: GroupSchemaType["id"]): Promise<GroupSchemaType>;
  byIds(ids: GroupSchemaType["id"][]): Promise<GroupSchemaType[]>;
  bySlug(slug: GroupSchemaType["slug"]): Promise<GroupSchemaType>;
  byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupSchemaType[]>;
  search(query: string): Promise<GroupSchemaType[]>;
  byCategory(
    category_id: CategorySchemaType["name"],
  ): Promise<GroupSchemaType[]>;
}

export class GroupsSelector implements IGroupsSelector {
  constructor(
    private readonly read: RawGroupsReader,
    private readonly validator: GroupsValidator,
  ) {}

  async all(): Promise<GroupSchemaType[]> {
    const raw = await this.read.allRawGroups();
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

  async byCategory(
    category_id: CategorySchemaType["name"],
  ): Promise<GroupSchemaType[]> {
    const raw = await this.read.rawByCategoryId(category_id);
    return this.validator.groups(raw);
  }

  async search(query: string): Promise<GroupSchemaType[]> {
    const raw = await this.read.byName(query);
    return this.validator.groups(raw);
  }
}
