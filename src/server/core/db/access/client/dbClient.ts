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
import { IEventsRepository } from "../repositories/events/eventsRepository";
import { IGroupsRepository } from "../repositories/groups/groupsRepository";
import { IAuthRepository } from "../repositories/auth/authRepository";
import { ICategoriesRepository } from "../repositories/categories/categoriesRepository";
import { IGroupMembersRepository } from "../repositories/groupMembers/groupMembersRepository";
import { IEventAttendantsRepository } from "../repositories/eventAttendants/eventAttendantsRepository";
import { INotificationsRepository } from "../repositories/notifications/notificationsRepository";

export interface IDBClient {
  readonly events: IEventsRepository;
  readonly groups: IGroupsRepository;
  readonly auth: IAuthRepository;
  readonly categories: ICategoriesRepository;
  readonly groupMembers: IGroupMembersRepository;
  readonly eventAttendants: IEventAttendantsRepository;
  readonly notifications: INotificationsRepository;
}

export class DBClient implements IDBClient {
  public readonly events: IEventsRepository;
  public readonly groups: IGroupsRepository;
  public readonly auth: IAuthRepository;
  public readonly categories: ICategoriesRepository;
  public readonly groupMembers: IGroupMembersRepository;
  public readonly eventAttendants: IEventAttendantsRepository;
  public readonly notifications: INotificationsRepository;
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
