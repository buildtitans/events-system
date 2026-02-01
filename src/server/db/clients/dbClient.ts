import type { DB } from "@/src/server/db/types/db";
import type { Kysely } from "kysely";
import { EventsClient } from "./dbEventsClient";
import { GroupsClient } from "./dbGroupsClient";
import { AuthClient } from "./authClient";
import { CategoriesClient } from "./dbCategoriesClient";
import { GroupMembersClient } from "./dbGroupMembersCleint";
import { EventAttendantsClient } from "./eventAttendantsClient";

export class DBClient {
    public readonly events: EventsClient;
    public readonly groups: GroupsClient;
    public readonly auth: AuthClient;
    public readonly categories: CategoriesClient;
    public readonly groupMembers: GroupMembersClient;
    public readonly eventAttendants: EventAttendantsClient;
    constructor(private db: Kysely<DB>) {
        this.db = db;
        this.groupMembers = new GroupMembersClient(this.db);
        this.events = new EventsClient(this.db);
        this.groups = new GroupsClient(db);
        this.auth = new AuthClient(db);
        this.categories = new CategoriesClient(db);
        this.eventAttendants = new EventAttendantsClient(db);
    };
};