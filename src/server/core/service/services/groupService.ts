import { DBClient } from "../../db";
import { GroupLifecycleHandler } from "../handlers/groupLifecycleHandler";
import { MembershipHandler } from "../handlers/membershipHandler";
import { Authorization } from "../auth/authorization";
import { GroupQueryHandler } from "../handlers/groupQueryHandler";

export class GroupService {
  public readonly groupLifecycle: GroupLifecycleHandler;
  public readonly memberships: MembershipHandler;
  public readonly query: GroupQueryHandler;
  constructor(
    private readonly db: DBClient,
    private readonly policy: Authorization,
  ) {
    this.groupLifecycle = new GroupLifecycleHandler(this.db, this.policy);
    this.memberships = new MembershipHandler(this.db, this.policy);
    this.query = new GroupQueryHandler(this.db);
  }
}
