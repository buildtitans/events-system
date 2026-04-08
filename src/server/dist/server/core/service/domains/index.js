"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Domains = void 0;
const participationsService_1 = require("@/src/server/core/service/services/participationsService");
const userService_1 = require("@/src/server/core/service/services/userService");
const groupService_1 = require("@/src/server/core/service/services/groupService");
const SessionService_1 = require("@/src/server/core/service/services/SessionService");
const EventService_1 = require("@/src/server/core/service/services/EventService");
const notificationService_1 = require("@/src/server/core/service/services/notificationService");
class Domains {
    db;
    policy;
    participations;
    users;
    session;
    groups;
    events;
    notifications;
    constructor(db, policy) {
        this.db = db;
        this.policy = policy;
        this.session = new SessionService_1.SessionService(this.db, this.policy);
        this.participations = new participationsService_1.ParticipationsService(this.db, this.policy);
        this.users = new userService_1.UserService(this.db, this.policy);
        this.groups = new groupService_1.GroupService(this.db, this.policy);
        this.events = new EventService_1.EventService(this.db, this.policy);
        this.notifications = new notificationService_1.NotificationService(this.db, this.policy);
    }
}
exports.Domains = Domains;
//# sourceMappingURL=index.js.map