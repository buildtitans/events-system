"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBClient = void 0;
const subClients_1 = require("@/src/server/core/db/clients/subClients");
class DBClient {
    db;
    events;
    groups;
    auth;
    categories;
    groupMembers;
    eventAttendants;
    notifications;
    constructor(db) {
        this.db = db;
        this.groupMembers = new subClients_1.GroupMembersClient(this.db);
        this.events = new subClients_1.EventsClient(this.db);
        this.groups = new subClients_1.GroupsClient(this.db);
        this.auth = new subClients_1.AuthClient(this.db);
        this.categories = new subClients_1.CategoriesClient(this.db);
        this.eventAttendants = new subClients_1.EventAttendantsClient(this.db);
        this.notifications = new subClients_1.NotificationsClient(this.db);
    }
}
exports.DBClient = DBClient;
//# sourceMappingURL=dbClient.js.map