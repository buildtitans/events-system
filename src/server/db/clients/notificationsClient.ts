import { Kysely } from "kysely";
import { DB, Notifications } from "../types/db";
import type { Insertable, Selectable } from "kysely";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
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
        notification: NotificationSchemaType
    ) {

        const row = this.toInsertableNotification(notification);

        return await this.insertNotification(row);
    }

    private async insertNotification(
        row: Insertable<Notifications>
    ): Promise<NotificationSchemaType> {

        const inserted = await this.db
            .insertInto("notifications")
            .values(row)
            .returningAll()
            .executeTakeFirstOrThrow();

        return this.parseRawNotification(inserted);
    };

    private toInsertableNotification(
        notification: NotificationSchemaType
    ): Insertable<Notifications> {

        const createdAt = dayjs(notification.created_at).utc().format(ISO_FORMAT);

        return {
            user_id: notification.user_id,
            group_id: notification.group_id,
            created_at: createdAt,
            seen: false,
            priority: notification.priority,
            message: notification.message
        }
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
        rows: Selectable<Notifications>[]
    ): NotificationSchemaArrayType {

        return NotificationSchemaArrayValidator(rows);
    };
}