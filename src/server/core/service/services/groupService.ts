import { GroupLifecycleHandler } from "../handlers/groups/groupLifecycleHandler";
import { MembershipHandler } from "../handlers/groups/membershipHandler";
import { IAuthorization } from "../auth/authorization";
import { GroupQueryHandler } from "../handlers/groups/groupQueryHandler";
import {
  IGroupLifecycleHandler,
  IGroupQueryHandler,
  IMembershipHandler,
} from "../handlers/groups/types";
import { GroupServiceDb, IGroupService } from "./types";

export class GroupService implements IGroupService {
  public readonly groupLifecycle: IGroupLifecycleHandler;
  public readonly memberships: IMembershipHandler;
  public readonly query: IGroupQueryHandler;
  constructor(
    private readonly db: GroupServiceDb,
    private readonly policy: IAuthorization,
  ) {
    this.groupLifecycle = new GroupLifecycleHandler(this.db, this.policy);
    this.memberships = new MembershipHandler(this.db, this.policy);
    this.query = new GroupQueryHandler(this.db);
  }
}
