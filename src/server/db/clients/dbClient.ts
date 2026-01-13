import type { DB } from "@/src/server/db/types/db";
import type { Kysely } from "kysely";
import { EventsClient } from "./dbEventsClient";
import { GroupsClient } from "./dbGroupsClient";


export class DBClient {
    public readonly events: EventsClient;
    public readonly groups: GroupsClient;

    constructor(private db: Kysely<DB>) {

        this.db = db;
        this.events = new EventsClient(this.db);
        this.groups = new GroupsClient(db);
    }

};