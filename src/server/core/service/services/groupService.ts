import { DBClient } from "../../db";
import { GroupLifecycleHandler } from "../handlers/groups/groupLifecycleHandler";
import { MembershipHandler } from "../handlers/groups/membershipHandler";
import { Authorization } from "../auth/authorization";
import { GroupQueryHandler } from "../handlers/groups/groupQueryHandler";
import {
  IGroupLifecycleHandler,
  IGroupQueryHandler,
  IMembershipHandler,
} from "../handlers/groups/types";

export class GroupService {
  public readonly groupLifecycle: IGroupLifecycleHandler;
  public readonly memberships: IMembershipHandler;
  public readonly query: IGroupQueryHandler;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.groupLifecycle = new GroupLifecycleHandler(this.db, this.policy);
    this.memberships = new MembershipHandler(this.db, this.policy);
    this.query = new GroupQueryHandler(this.db);
  }
}
