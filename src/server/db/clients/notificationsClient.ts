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


    async addNewNotification(
        notification: CreateNotificationSchemaType,
        memberIds: string[]
    ) {

        const row = this.toInsertableNotifications(notification, memberIds);

        return await this.insertNotifications(row);
    }

    private async insertNotifications(
        rows: Insertable<Notifications>[]
    ): Promise<NotificationSchemaArrayType> {

        const notifications = rows.map(async (row: Insertable<Notifications>) => {
            return await this.db
                .insertInto("notifications")
                .values(rows)
                .returningAll()
                .executeTakeFirstOrThrow();
        })
        return this.parseRawNotifications(notifications);
    };

    private toInsertableNotifications(
        notification: CreateNotificationSchemaType,
        memberIds: string[]
    ): Insertable<Notifications>[] {
        const insertableRows: Insertable<Notifications>[] = [];

        memberIds.forEach((id: string) => {

            const notif = {
                user_id: id,
                group_id: notification.group_id,
                created_at: dayjs(new Date()).utc().format(ISO_FORMAT),
                seen: false,
                priority: notification.priority,
                message: notification.message
            };
            insertableRows.push(notif);
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

    private parseRawNotification(
        row: Selectable<Notifications>
    ): NotificationSchemaType {

        const created_at = dayjs(row.created_at)
            .utc()
            .format(ISO_FORMAT);

        return NotificationSchemaValidator({
            created_at: created_at,
            updated_at: row.updated_at ?? created_at,
            user_id: row.user_id,
            group_id: row.group_id,
            message: row.message,
            seen: row.seen,
            priority: row.priority,
            id: row.id
        })
    };

    private parseRawNotifications(
        rows: unknown
    ): NotificationSchemaArrayType {

        return NotificationSchemaArrayValidator(rows);
    };
}