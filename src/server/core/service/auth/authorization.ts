import { IRoleBasedAccessHandler } from "@/src/server/core/service/auth/roleBasedAccessHandler";
import { TRPCResolverError } from "@/src/server/core/lib/errors/trpcResolverError";

export interface IAuthorization {
  requireAuthenticated(userId: string | undefined | null): string;
  requireToken(token: string | undefined | null): string;
  requireOrganizer(userId: string, groupId: string): Promise<void>;
  requireIsGroupMember(userId: string, groupId: string): Promise<void>;
  requireCanChangeMembership(userId: string, groupId: string): Promise<void>;
}

export class Authorization implements IAuthorization {
  constructor(private readonly auth: IRoleBasedAccessHandler) {}

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

  async requireOrganizer(userId: string, groupId: string): Promise<void> {
    const permitted = await this.auth.can(userId, groupId, "manage group");

    if (!permitted) {
      throw new TRPCResolverError(
        403,
        "Permission to manage this group denied",
      );
    }
  }

  async requireIsGroupMember(userId: string, groupId: string): Promise<void> {
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

  async requireCanChangeMembership(
    userId: string,
    groupId: string,
  ): Promise<void> {
    const permitted = await this.auth.can(userId, groupId, "change membership");

    if (!permitted) {
      throw new TRPCResolverError(
        403,
        "Permission to manage this group denied",
      );
    }
  }
}
