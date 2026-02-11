import { Insertable, Kysely, Selectable } from "kysely";
import { DB } from "../types/db";
import type { Events } from "../types/db";
import { compileEventsLayout } from "../../layout/compileEventsLayout";
import { EventSchemaType, NewEventInputSchemaType, UpdateEventArgsSchemaType } from "@/src/schemas/events/eventSchema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { PaginatedLayoutSchemaType } from "@/src/schemas/layoutSlotSchema";
import { eventValidator } from "@/src/lib/utils/validation/validateSchema";
dayjs.extend(utc);

export class EventsClient {
    constructor(private readonly db: Kysely<DB>) {
        this.db = db;
    }

    async getEvents() {
        const raw = await this.getRawEvents();
        const layout = compileEventsLayout(raw);
        return layout;
    }

    async getGroupEvents(group_id: Selectable<Events>["group_id"]): Promise<PaginatedLayoutSchemaType> {

        const raw = await this.getRawEventsFromGroup(group_id);
        if (!Array.isArray(raw) || (raw.length === 0)) return [];
        return compileEventsLayout(raw);
    }

    async updateEventStatus(eventUpdate: UpdateEventArgsSchemaType): Promise<{ updateStatus: "success" | "failure" }> {

        const update = await this.db
            .updateTable("events")
            .set({
                status: eventUpdate.status
            })
            .where("id", "=", eventUpdate.event_id)
            .executeTakeFirstOrThrow();

        return { updateStatus: update ? "success" : "failure" };
    }


    private async getRawEvents(): Promise<Selectable<Events>[]> {
        return this.db
            .selectFrom("events")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();
    }

    private async getRawEventsFromGroup(group_id: Selectable<Events>["group_id"]): Promise<Selectable<Events>[] | undefined> {

        const raw = this.db.selectFrom("events").selectAll().where("group_id", "=", group_id).orderBy("created_at").execute()

        return raw;

    }



    async createNewEvent(newEvent: NewEventInputSchemaType): Promise<EventSchemaType | null> {
        const insertable = this.toInsertableEvent(newEvent);
        const inserted = await this.insertNewEvent(insertable);
        const event = inserted ? this.formatEvent(inserted) : inserted;
        return event
    };


    toInsertableEvent(newEvent: NewEventInputSchemaType): Insertable<Events> {

        const { title, description, starts_at, group_id, authors, meeting_location } = newEvent;

        const start_time = dayjs(starts_at).utc().format('YYYY-MM-DDTHH:mm:ss.sssZ');

        const stringified_authors = JSON.stringify(authors);

        const parsed: Insertable<Events> = {
            title: title,
            description: description,
            img: "https://picsum.photos/800/450?random=2",
            group_id: group_id,
            authors: stringified_authors,
            starts_at: start_time,
            created_at: new Date(),
            tag: "placeholder tag",
            meeting_location: meeting_location,
            status: "scheduled"
        }

        return parsed;
    }


    private async insertNewEvent(newEvent: Insertable<Events>): Promise<Selectable<Events> | null> {

        const inserted = await this.db
            .insertInto("events")
            .values(newEvent)
            .returningAll()
            .executeTakeFirst()

        return inserted ? inserted : null
    }


    private formatEvent(raw: Selectable<Events>): EventSchemaType {
        const parsed_authors = typeof raw.authors === "string" ? JSON.parse(raw.authors) : raw.authors

        const parsed = eventValidator({
            id: raw.id,
            tag: raw.tag,
            title: raw.title,
            description: raw.description,
            updated_at: raw.updated_at.toISOString(),
            created_at: raw.created_at.toISOString(),
            group_id: raw.group_id,
            authors: parsed_authors,
            starts_at: raw.starts_at.toISOString(),
            img: raw.img,
            meeting_location: raw.meeting_location,
            status: raw.status
        });

        return parsed
    }

}