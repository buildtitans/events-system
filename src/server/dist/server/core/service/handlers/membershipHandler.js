"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembershipHandler = void 0;
class MembershipHandler {
    db;
    policy;
    constructor(db, policy) {
        this.db = db;
        this.policy = policy;
    }
    async addMember(user_id, group_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        await this.policy.requireCanChangeMembership(userId, group_id);
        return await this.db.groupMembers.addNewMember({
            user_id: userId,
            group_id,
        });
    }
    async leaveGroup(group_id, user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        await this.policy.requireCanChangeMembership(userId, group_id);
        return await this.db.groupMembers.removeMember(userId, group_id);
    }
    async getRoleInGroup(user_id, group_id) {
        if (!user_id)
            return "anonymous";
        const role = await this.db.groupMembers.getMembershipRole(user_id, group_id);
        return role ?? "anonymous";
    }
    async getGroupHeadCount(group_id) {
        const members = await this.db.groupMembers.getGroupMembers(group_id);
        return members.length;
    }
}
exports.MembershipHandler = MembershipHandler;
//# sourceMappingURL=membershipHandler.js.map