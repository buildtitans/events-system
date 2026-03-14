import { DBClient } from "../../db";
import { GroupLifecycleHandler } from "../handlers/groupLifecycleHandler";
import { MembershipHandler } from "../handlers/membershipHandler";
import { AuthorizationService } from "./authorizationService";

export class GroupManagementService {
  public readonly groupLifecycle: GroupLifecycleHandler;
  public readonly memberships: MembershipHandler;

  constructor(
    private readonly db: DBClient,
    private readonly policy: AuthorizationService,
  ) {
    this.groupLifecycle = new GroupLifecycleHandler(this.db, this.policy);
    this.memberships = new MembershipHandler(this.db, this.policy);
  }
}
