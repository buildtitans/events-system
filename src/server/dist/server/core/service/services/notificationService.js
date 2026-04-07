"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    db;
    policy;
    constructor(db, policy) {
        this.db = db;
        this.policy = policy;
    }
    async getNewNotifications(user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        return this.db.notifications.getUnseenNotifications(userId);
    }
    async createNotification(notification, user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        await this.policy.requireCanManageGroup(userId, notification.group_id);
        const memberIds = await this.db.groupMembers.getMemberIds(notification.group_id);
        return await this.db.notifications.addNewNotifications(notification, memberIds);
    }
    async markSeen(user_id, seenNotifications) {
        const userId = this.policy.requireAuthenticated(user_id);
        await this.checkSeenNotifications(seenNotifications, userId);
        const ids = seenNotifications.map((notif) => notif.id);
        const result = await this.db.notifications.markOpenedNotifications({
            ids: ids,
            userId,
        });
        const updates = Number(result.numUpdatedRows);
        if (updates > 0) {
            return {
                ok: true,
                numUpdated: updates,
            };
        }
        else {
            return {
                ok: false,
                error: "Failed to update status on read notifications",
            };
        }
    }
    async checkSeenNotifications(seenNotifications, userId) {
        const uniqueGroupIds = new Set(seenNotifications.map((notif) => notif.group_id));
        for (const groupId of uniqueGroupIds) {
            await this.policy.requireIsGroupMember(userId, groupId);
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map