import type { DB } from "@/src/server/src/db/types/db";
import type { Kysely } from "kysely";
import {
  EventsClient,
  GroupMembersClient,
  GroupsClient,
  AuthClient,
  CategoriesClient,
  EventAttendantsClient,
  NotificationsClient,
} from "@/src/server/src/db/clients/subClients";

export class DBClient {
  public readonly events: EventsClient;
  public readonly groups: GroupsClient;
  public readonly auth: AuthClient;
  public readonly categories: CategoriesClient;
  public readonly groupMembers: GroupMembersClient;
  public readonly eventAttendants: EventAttendantsClient;
  public readonly notifications: NotificationsClient;
  constructor(private db: Kysely<DB>) {
    this.groupMembers = new GroupMembersClient(this.db);
    this.events = new EventsClient(this.db);
    this.groups = new GroupsClient(this.db);
    this.auth = new AuthClient(this.db);
    this.categories = new CategoriesClient(this.db);
    this.eventAttendants = new EventAttendantsClient(this.db);
    this.notifications = new NotificationsClient(this.db);
  }
}
