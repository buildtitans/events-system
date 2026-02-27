import { Kysely } from "kysely";
import { DB, Notifications } from "@/src/server/db/types/db";
import type { Insertable, Selectable } from "kysely";
import {
    CreateNotificationSchemaType,
    NotificationSchemaArrayType,
    NotificationSchemaArrayValidator,
    NotificationSchemaType,
} from "@/src/schemas/notifications/notificationsSchema";
import { NotificationCreationProcedure } from "@/src/server/db/clients/types/types";

export class NotificationsClient {

    constructor(private readonly db: Kysely<DB>) {
    }

    async markOpenedNotifications(ids: NotificationSchemaType["id"][]): Promise<void> {

        const marked = await this.db
            .updateTable("notifications")
            .set({ status: "seen" })
            .where("id", "in", ids)
            .executeTakeFirstOrThrow();

        console.log({
            "Status Update Success": marked ? "Success" : "Failed",
            "Data": marked
        });

    };

    async getUnseenNotifications(
        user_id: string
    ): Promise<NotificationSchemaArrayType> {

        const rows = await this.getRawNotifications(user_id);

        return this.parseRawNotifications(rows);
    }

    async addNewNotifications(
        notification: CreateNotificationSchemaType,
        memberIds: string[]
    ): Promise<NotificationCreationProcedure> {

        const rows = this.toInsertableNotifications(notification, memberIds);

        const createdNotifications = await this.insertNotifications(rows);

        console.log({
            "Number of Members Notified": createdNotifications.length,
            "copies": createdNotifications
        });

        return {
            ok: createdNotifications.length > 0 ? true : false,
            items: createdNotifications
        }
    }

    private async insertNotifications(
        rows: Insertable<Notifications>[]
    ): Promise<NotificationSchemaArrayType> {

        const notifications = await this.db
            .insertInto("notifications")
            .values(rows)
            .returningAll()
            .execute();

        return this.parseRawNotifications(notifications);
    };

    private toInsertableNotifications(
        notification: CreateNotificationSchemaType,
        memberIds: string[]
    ): Insertable<Notifications>[] {
        const insertableRows: Insertable<Notifications>[] = [];

        memberIds.forEach((id: string) => {

            insertableRows.push({
                user_id: id,
                group_id: notification.group_id,
                priority: notification.priority,
                message: notification.message,
                subject: notification.subject
            })
        });
        return insertableRows
    }


    private async getRawNotifications(
        user_id: string,
    ): Promise<Selectable<Notifications>[]> {

        return await this.db
            .selectFrom("notifications")
            .selectAll()
            .where("user_id", "=", user_id)
            .where("status", "=", "new")
            .execute()
    };

    private parseRawNotifications(
        rows: Selectable<Notifications>[]
    ): NotificationSchemaArrayType {

        const parsed = this.formatNewNotifications(rows);

        return NotificationSchemaArrayValidator(parsed);
    };


    private formatNewNotifications(
        rows: Selectable<Notifications>[]
    ) {
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
                id: row.id
            }
        })
    }
}