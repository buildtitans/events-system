"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsClient = void 0;
const notificationsSchema_1 = require("@/src/schemas/notifications/notificationsSchema");
class NotificationsClient {
    db;
    constructor(db) {
        this.db = db;
    }
    async markOpenedNotifications({ ids, userId, }) {
        return await this.db
            .updateTable("notifications")
            .set({ status: "seen" })
            .where("id", "in", ids)
            .where("user_id", "=", userId)
            .executeTakeFirstOrThrow();
    }
    async getUnseenNotifications(user_id) {
        const rows = await this.getRawNotifications(user_id);
        return this.parseRawNotifications(rows);
    }
    async addNewNotifications(notification, memberIds) {
        const rows = this.toInsertableNotifications(notification, memberIds);
        const createdNotifications = await this.insertNotifications(rows);
        console.log({
            "Number of Members Notified": createdNotifications.length,
            copies: createdNotifications,
        });
        return {
            ok: createdNotifications.length > 0 ? true : false,
            items: createdNotifications,
        };
    }
    async insertNotifications(rows) {
        const notifications = await this.db
            .insertInto("notifications")
            .values(rows)
            .returningAll()
            .execute();
        return this.parseRawNotifications(notifications);
    }
    toInsertableNotifications(notification, memberIds) {
        const insertableRows = [];
        memberIds.forEach((id) => {
            insertableRows.push({
                user_id: id,
                group_id: notification.group_id,
                priority: notification.priority,
                message: notification.message,
                subject: notification.subject,
            });
        });
        return insertableRows;
    }
    async getRawNotifications(user_id) {
        return await this.db
            .selectFrom("notifications")
            .selectAll()
            .where("user_id", "=", user_id)
            .where("status", "=", "new")
            .execute();
    }
    parseRawNotifications(rows) {
        const parsed = this.formatNewNotifications(rows);
        return (0, notificationsSchema_1.NotificationSchemaArrayValidator)(parsed);
    }
    formatNewNotifications(rows) {
        return rows.map((row) => {
            return {
                user_id: row.user_id,
                group_id: row.group_id,
                message: row.message,
                subject: row.subject,
                created_at: row.created_at.toISOString(),
                updated_at: row.updated_at?.toISOString() ?? row.created_at.toISOString(),
                status: row.status,
                priority: row.priority,
                id: row.id,
            };
        });
    }
}
exports.NotificationsClient = NotificationsClient;
//# sourceMappingURL=notificationsClient.js.map