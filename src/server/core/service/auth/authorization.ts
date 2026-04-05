import { RoleBasedAccessHandler } from "./roleBasedAccessHandler";
import { TRPCResolverError } from "../../lib/errors/trpcResolverError";

export class Authorization {
  constructor(private readonly auth: RoleBasedAccessHandler) {}

  requireAuthenticated(userId: string | undefined | null): string {
    if (!userId) {
      throw new TRPCResolverError(401, "Authentication required");
    }

    return userId;
  }

  requireToken(token: string | undefined | null) {
    if (!token) {
      throw new TRPCResolverError(404, "Could not find token");
    }

    return token;
  }

  async requireCanCreateEvent(userId: string, groupId: string): Promise<void> {
    const permitted = await this.auth.can(userId, groupId, "manage events");

    if (!permitted) {
      throw new TRPCResolverError(403, "Permission to create an event denied");
    }
  }

  async requireCanManageGroup(userId: string, groupId: string): Promise<void> {
    const permitted = await this.auth.can(userId, groupId, "manage group");

    if (!permitted) {
      throw new TRPCResolverError(
        403,
        "Permission to manage this group denied",
      );
    }
  }

  async requireIsGroupMember(userId: string, groupId: string) {
    const permitted = await this.auth.can(
      userId,
      groupId,
      "read or receive notifications",
    );

    if (!permitted) {
      throw new TRPCResolverError(
        403,
        "Permission to read notifications for this group denied",
      );
    }
  }

  async requireCanChangeMembership(userId: string, groupId: string) {
    const permitted = await this.auth.can(userId, groupId, "change membership");

    if (!permitted) {
      throw new TRPCResolverError(
        403,
        "Permission to manage this group denied",
      );
    }
  }
}
