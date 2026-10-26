import type { IGroupsReader } from "../read/groupsReader";
import type { IGroupsValidator } from "../validate/groupsValidator";
import type { CategorySchemaType } from "@/src/schemas/groups/categoriesSchema";
import type {
  GroupSchemaType,
  GroupDiscoverySummarySchemaType,
  GroupHydrationReadSchemaType,
  GroupRefreshReadSchemaType,
} from "@/src/schemas/groups/groupSchema";
import type { AuthenticatedUserId } from "@/src/server/core/service/handlers/session/SessionHandler";

export interface IGroupsViewSelector {
  single(
    slug: GroupSchemaType["slug"],
    userId?: AuthenticatedUserId,
  ): Promise<GroupHydrationReadSchemaType>;
  refresh(id: GroupSchemaType["id"]): Promise<GroupRefreshReadSchemaType>;
  readonly list: IGroupsListViewSelector;
}
export class GroupsViewSelector implements IGroupsViewSelector {
  public readonly list: IGroupsListViewSelector;
  constructor(
    private readonly read: IGroupsReader["hydrate"],
    private readonly validator: IGroupsValidator,
  ) {
    this.list = new GroupsListViewSelector(this.read.list, this.validator);
  }
  async single(slug: GroupSchemaType["slug"], userId?: AuthenticatedUserId) {
    const hydratedGroup = await this.read.single(slug, userId);
    return this.validator.hydrated(hydratedGroup);
  }

  async refresh(id: GroupSchemaType["id"]) {
    const refresh = await this.read.refreshGroup(id);
    return this.validator.refresh(refresh);
  }
}
interface IGroupsListViewSelector {
  all(): Promise<GroupDiscoverySummarySchemaType[]>;
  popular(): Promise<GroupDiscoverySummarySchemaType[]>;
  byCategory(
    category_id: CategorySchemaType["id"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
  byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupDiscoverySummarySchemaType[]>;
}
class GroupsListViewSelector implements IGroupsListViewSelector {
  constructor(
    private readonly read: IGroupsReader["hydrate"]["list"],
    private readonly validator: IGroupsValidator,
  ) {}
  async all(): Promise<GroupDiscoverySummarySchemaType[]> {
    const raw = await this.read.all();
    return this.validator.discovery(raw);
  }
  async popular(): Promise<GroupDiscoverySummarySchemaType[]> {
    const raw = await this.read.popular();
    return this.validator.discovery(raw);
  }
  async byCategory(
    category_id: CategorySchemaType["id"],
  ): Promise<GroupDiscoverySummarySchemaType[]> {
    const raw = await this.read.byCategoryId(category_id);
    return this.validator.discovery(raw);
  }
  async byOrganizerId(
    organizer_id: GroupSchemaType["organizer_id"],
  ): Promise<GroupDiscoverySummarySchemaType[]> {
    const raw = await this.read.byOrganizerId(organizer_id);
    return this.validator.discovery(raw);
  }
}
