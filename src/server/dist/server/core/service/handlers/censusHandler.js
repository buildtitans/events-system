"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CensusHandler = void 0;
const curatePopularEventsIds_1 = require("../../lib/utils/curatePopularEventsIds");
class CensusHandler {
    api;
    constructor(api) {
        this.api = api;
    }
    async getNumberOfAttendantsForEvent(event_id) {
        const attendants = await this.api.eventAttendants.getAttendants(event_id);
        return this.countEventAttendants(attendants);
    }
    async getGroupHeadCount(group_id) {
        const members = await this.api.groupMembers.getGroupMembers(group_id);
        return members.length;
    }
    async getPopularEventsIds() {
        const records = await this.api.eventAttendants.getAllAttendanceRecords();
        return (0, curatePopularEventsIds_1.curatePopularEventsIds)(records);
    }
    countEventAttendants(attendants) {
        const filteredGoing = attendants.filter((attendant) => attendant.status === "going");
        const filteredInterested = attendants.filter((attendant) => attendant.status === "interested");
        return {
            numGoing: filteredGoing.length ?? 0,
            numInterested: filteredInterested.length ?? 0,
        };
    }
}
exports.CensusHandler = CensusHandler;
//# sourceMappingURL=censusHandler.js.map