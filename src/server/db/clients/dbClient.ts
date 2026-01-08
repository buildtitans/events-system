import type { DB } from "@/src/server/db/types/types";
import type { Kysely } from "kysely";


export class DBClient {

    constructor(private db: Kysely<DB>) {
        this.db = db
    }


    async getEvents() {
        return this.db
            .selectFrom("events")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();
    }


    async createGroup(body: any) {

    }


    //TODO: add handler to create new events from user input


};