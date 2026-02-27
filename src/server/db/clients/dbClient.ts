import type { DB } from "@/src/server/db/types/db";
import type { Kysely } from "kysely";
import { EventsClient } from "@/src/server/db/clients/subClients/EventsClient";
import { GroupsClient } from "@/src/server/db/clients/subClients/GroupsClient";
import { AuthClient } from "@/src/server/db/clients/subClients/authClient";
import { CategoriesClient } from "@/src/server/db/clients/subClients/CategoriesClient";
import { GroupMembersClient } from "@/src/server/db/clients/subClients/GroupMembersCleint";
import { EventAttendantsClient } from "@/src/server/db/clients/subClients/eventAttendantsClient";
import { NotificationsClient } from "@/src/server/db/clients/subClients/notificationsClient";

export class DBClient {
    public readonly events: EventsClient;
    public readonly groups: GroupsClient;
    public readonly auth: AuthClient;
    public readonly categories: CategoriesClient;
    public readonly groupMembers: GroupMembersClient;
    public readonly eventAttendants: EventAttendantsClient;
    public readonly notifications: NotificationsClient;
    constructor(private db: Kysely<DB>) {
        this.db = db;
        this.groupMembers = new GroupMembersClient(this.db);
        this.events = new EventsClient(this.db);
        this.groups = new GroupsClient(db);
        this.auth = new AuthClient(db);
        this.categories = new CategoriesClient(db);
        this.eventAttendants = new EventAttendantsClient(db);
        this.notifications = new NotificationsClient(db)
    };
};