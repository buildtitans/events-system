import { Kysely } from "kysely";
import { DB } from "../types/db";


export class GroupsClient {

    constructor(private readonly db: Kysely<DB>) {
        this.db = db;
    }

    async getGroups() {
        return this.db
            .selectFrom("groups")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute()
    }
}