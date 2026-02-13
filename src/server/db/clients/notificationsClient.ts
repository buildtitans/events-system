import { Kysely } from "kysely";
import { DB, Notifications } from "../types/db";
import type { Insertable, Selectable } from "kysely";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
    CreateNotificationSchemaType,
    NotificationSchemaArrayType,
    NotificationSchemaArrayValidator,
    NotificationSchemaType,
    NotificationSchemaValidator
} from "@/src/schemas/notifications/notificationsSchema";


dayjs.extend(utc);
const ISO_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";


export class NotificationsClient {

    constructor(private readonly db: Kysely<DB>) {
    }

    async getUnseenNotifications(
        user_id: string
    ): Promise<NotificationSchemaArrayType> {

        const rows = await this.getRawNotifications(user_id);

        return this.parseRawNotifications(rows);
    }


    async addNewNotifications(
        notification: CreateNotificationSchemaType,
        memberIds: string[]
    ) {

        const rows = this.toInsertableNotifications(notification, memberIds);

        return await this.insertNotifications(rows);
    }

    private async insertNotifications(
        rows: Insertable<Notifications>[]
    ): Promise<NotificationSchemaArrayType> {

        const notifications = await this.db
            .insertInto("notifications")
            .values(rows)
            .returningAll()
            .execute();

        console.log({
            "Result": `${notifications.length > 0 ? 'success' : 'failed'}`,
            "Returned": notifications
        });

        return this.parseRawNotifications(notifications);
    };

    private toInsertableNotifications(
        notification: CreateNotificationSchemaType,
        memberIds: string[]
    ): Insertable<Notifications>[] {
        const insertableRows: Insertable<Notifications>[] = [];

        console.log({ "Number of Members": memberIds.length });

        memberIds.forEach((id: string) => {

            insertableRows.push({
                user_id: id,
                group_id: notification.group_id,
                seen: false,
                priority: notification.priority,
                message: notification.message
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
            .where("seen", "=", false)
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
                created_at: row.created_at.toISOString(),
                updated_at: row.updated_at?.toISOString() ?? row.created_at.toISOString(),
                seen: row.seen,
                priority: row.priority,
                id: row.id
            }
        })
    }
}