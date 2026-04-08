"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = void 0;
const trpcResolverError_1 = require("../../lib/errors/trpcResolverError");
class Authorization {
    auth;
    constructor(auth) {
        this.auth = auth;
    }
    requireAuthenticated(userId) {
        if (!userId) {
            throw new trpcResolverError_1.TRPCResolverError(401, "Authentication required");
        }
        return userId;
    }
    requireToken(token) {
        if (!token) {
            throw new trpcResolverError_1.TRPCResolverError(404, "Could not find token");
        }
        return token;
    }
    async requireCanCreateEvent(userId, groupId) {
        const permitted = await this.auth.can(userId, groupId, "manage events");
        if (!permitted) {
            throw new trpcResolverError_1.TRPCResolverError(403, "Permission to create an event denied");
        }
    }
    async requireCanManageGroup(userId, groupId) {
        const permitted = await this.auth.can(userId, groupId, "manage group");
        if (!permitted) {
            throw new trpcResolverError_1.TRPCResolverError(403, "Permission to manage this group denied");
        }
    }
    async requireIsGroupMember(userId, groupId) {
        const permitted = await this.auth.can(userId, groupId, "read or receive notifications");
        if (!permitted) {
            throw new trpcResolverError_1.TRPCResolverError(403, "Permission to read notifications for this group denied");
        }
    }
    async requireCanChangeMembership(userId, groupId) {
        const permitted = await this.auth.can(userId, groupId, "change membership");
        if (!permitted) {
            throw new trpcResolverError_1.TRPCResolverError(403, "Permission to manage this group denied");
        }
    }
}
exports.Authorization = Authorization;
//# sourceMappingURL=authorization.js.map