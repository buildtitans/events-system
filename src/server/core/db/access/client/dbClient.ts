import type { DB } from "@/src/server/core/db/types/db";
import type { Kysely } from "kysely";
import {
  EventsRepository,
  GroupMembersRepository,
  GroupsRepository,
  AuthRepository,
  CategoriesRepository,
  EventAttendantsRepository,
  NotificationsRepository,
} from "../repositories";

export class DBClient {
  public readonly events: EventsRepository;
  public readonly groups: GroupsRepository;
  public readonly auth: AuthRepository;
  public readonly categories: CategoriesRepository;
  public readonly groupMembers: GroupMembersRepository;
  public readonly eventAttendants: EventAttendantsRepository;
  public readonly notifications: NotificationsRepository;
  constructor(private db: Kysely<DB>) {
    this.groupMembers = new GroupMembersRepository(this.db);
    this.events = new EventsRepository(this.db);
    this.groups = new GroupsRepository(this.db);
    this.auth = new AuthRepository(this.db);
    this.categories = new CategoriesRepository(this.db);
    this.eventAttendants = new EventAttendantsRepository(this.db);
    this.notifications = new NotificationsRepository(this.db);
  }
}
