"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHydrationHandler = void 0;
const schemaValidators_1 = require("../../lib/validation/schemaValidators");
class EventHydrationHandler {
    db;
    constructor(db) {
        this.db = db;
    }
    async openedEvent(user_id, event_id) {
        const rsvpStatus = await this.getEventRsvp(user_id, event_id);
        const attendants = await this.getAttendingAndInterested(event_id);
        const role = await this.getUserRoleInGroup(user_id, event_id);
        return {
            rsvpStatus,
            attendants,
            role,
        };
    }
    async getUserRoleInGroup(user_id, event_id) {
        const event = await this.db.events.getEvent(event_id);
        if (user_id && event) {
            return await this.db.groupMembers.getMembershipRole(user_id, event.group_id);
        }
        else
            return "anonymous";
    }
    async getEventRsvp(user_id, event_id) {
        if (user_id) {
            const status = await this.db.eventAttendants.getUserRsvpStatusToEvent(user_id, event_id);
            return (0, schemaValidators_1.RsvpStatusSchemaValidator)(status);
        }
        else {
            return "not_going";
        }
    }
    async getAttendingAndInterested(event_id) {
        const attendance = await this.db.eventAttendants.getAttendants(event_id);
        let goingCount = 0;
        let interestedCount = 0;
        attendance.forEach((att) => {
            if (att.status === "going") {
                goingCount++;
            }
        });
        attendance.forEach((att) => {
            if (att.status === "interested") {
                interestedCount++;
            }
        });
        return {
            going: goingCount,
            interested: interestedCount,
        };
    }
}
exports.EventHydrationHandler = EventHydrationHandler;
//# sourceMappingURL=hydrationHandler.js.map