import { Insertable, Kysely, Selectable } from "kysely";
import { DB } from "../types/db";
import type { Events } from "../types/db";
import { compileEventsLayout } from "../../layout/compileEventsLayout";
import { NewEventType } from "@/src/lib/hooks/insert/useCreateEvent";
import { EventSchemaType, NewEventInputSchemaType } from "@/src/schemas/eventSchema";

export class EventsClient {
    constructor(private readonly db: Kysely<DB>) {
        this.db = db;
    }


    async getEvents() {
        const raw = await this.getRawEvents();
        const layout = compileEventsLayout(raw);
        return layout;
    }

    async getRawEvents(): Promise<Selectable<Events>[]> {
        return this.db
            .selectFrom("events")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();
    }


    async createNewEvent(newEvent: NewEventInputSchemaType): Promise<EventSchemaType | null> {
        const insertable = this.toInsertableEvent(newEvent);
        const inserted = await this.insertNewEvent(insertable);
        const event = inserted ? this.formatEvent(inserted) : inserted;
        return event
    };


    toInsertableEvent(newEvent: NewEventInputSchemaType): Insertable<Events> {

        const { title, description, starts_at, group_id, authors } = newEvent;

        const parsed: Insertable<Events> = {
            title: title,
            description: description,
            img: "https://picsum.photos/800/450?random=2",
            group_id: group_id,
            authors: authors,
            starts_at: starts_at,
            created_at: new Date(),
            tag: "placeholder tag",
        }

        return parsed;
    }


    async insertNewEvent(newEvent: Insertable<Events>): Promise<Selectable<Events> | null> {

        const inserted = await this.db
            .insertInto("events")
            .values(newEvent)
            .returningAll()
            .executeTakeFirst()

        return inserted ? inserted : null
    }


    formatEvent(raw: Selectable<Events>): EventSchemaType {
        const parsed_authors = typeof raw.authors === "string" ? JSON.parse(raw.authors) : raw.authors

        return {
            id: raw.id,
            tag: raw.tag,
            title: raw.title,
            description: raw.description,
            updated_at: raw.updated_at.toISOString(),
            created_at: raw.created_at.toISOString(),
            group_id: raw.group_id,
            authors: parsed_authors,
            starts_at: raw.starts_at.toISOString(),
            img: raw.img
        }
    }

}