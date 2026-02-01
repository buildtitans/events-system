import {
    Kysely,
    Selectable
} from "kysely";
import {
    DB,
    EventAttendants
} from "@/src/server/db/types/db";
import {
    EventAttendantsSchemaType,
    ValidateRawAttendants
} from "@/src/schemas/eventAttendantsSchema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const ISO_FORMAT = "YYYY-MM-DDTHH:mm:ss.sssZ";

export class EventAttendantsClient {
    constructor(
        private readonly db: Kysely<DB>
    ) { }

    async getAttendants(
        event_id: string
    ): Promise<EventAttendantsSchemaType[]> {
        const raw = await this.getRawAttendants(event_id);
        return this.parseRawAttendants(raw);
    }

    async getRawAttendants(
        event_id: string
    ): Promise<Selectable<EventAttendants>[]> {

        return await this.db
            .selectFrom("event_attendants")
            .selectAll()
            .where("event_id", "=", event_id)
            .execute();
    }

    parseRawAttendants(
        raw: Selectable<EventAttendants>[]
    ): EventAttendantsSchemaType[] {

        return raw.map((row) => {
            const created_at = dayjs(row.created_at)
                .utc()
                .format(ISO_FORMAT);

            const updated_at = row.updated_at

                ? dayjs(row.updated_at)
                    .utc()
                    .format(ISO_FORMAT)

                : null;

            return ValidateRawAttendants({
                event_id: row.event_id,
                user_id: row.user_id,
                status: row.status,
                created_at,
                updated_at
            });

        });
    }
};