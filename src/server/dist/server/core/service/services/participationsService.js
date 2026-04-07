"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipationsService = void 0;
const eventAttendantsSchema_1 = require("@/src/schemas/events/eventAttendantsSchema");
const rsvpSchema_1 = require("@/src/schemas/events/rsvpSchema");
const userMembershipSchema_1 = require("@/src/schemas/groups/userMembershipSchema");
const mapAttendanceDictionary_1 = require("@/src/server/core/lib/utils/mapAttendanceDictionary");
const censusHandler_1 = require("../handlers/censusHandler");
const filterRsvps_1 = require("@/src/server/core/lib/utils/filterRsvps");
const buildGroupNameLookup_1 = require("@/src/server/core/lib/utils/buildGroupNameLookup");
const participationDtoHandler_1 = require("../handlers/participationDtoHandler");
class ParticipationsService {
    db;
    policy;
    census;
    parse;
    constructor(db, policy) {
        this.db = db;
        this.policy = policy;
        this.census = new censusHandler_1.CensusHandler(this.db);
        this.parse = new participationDtoHandler_1.ParticipationDtoHandler(this.db);
    }
    async updateRsvpStatus(user_id, event_id, newStatus) {
        const userId = this.policy.requireAuthenticated(user_id);
        return await this.db.eventAttendants.updateAttendanceStatus({ event_id, user_id: userId }, newStatus);
    }
    async getUserRsvpToEvent(user_id, event_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        const result = await this.db.eventAttendants.getUserRsvpStatusToEvent(userId, event_id);
        return (0, eventAttendantsSchema_1.RsvpStatusSchemaValidator)(result);
    }
    async getAttendanceDictionary(user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        const ids = (await this.db.events.getEvents()).map((event) => event.id);
        const userAttendanceRecords = await this.db.eventAttendants.getUserAttendanceRecords(userId);
        return (0, mapAttendanceDictionary_1.mapAttendanceDictionary)(ids, userAttendanceRecords);
    }
    async getMemberships(user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        const rawGroups = await this.db.groups.getGroups();
        const rawMemberships = await this.db.groupMembers.getViewerMemberships(userId);
        const nameSlugDescriptionLookup = (0, buildGroupNameLookup_1.buildGroupNameLookup)(rawGroups);
        const parsed = await this.parse.toUserMembershipShape(rawMemberships, rawGroups, nameSlugDescriptionLookup);
        return (0, userMembershipSchema_1.UserMembershipSchemaArrayValidator)(parsed);
    }
    async getRsvpdEvents(user_id) {
        const userId = this.policy.requireAuthenticated(user_id);
        const groups = await this.db.groups.getGroups();
        const userRecords = await this.db.eventAttendants.getUserAttendanceRecords(userId);
        const hash = (0, buildGroupNameLookup_1.buildGroupNameLookup)(groups);
        const filtered = (0, filterRsvps_1.filterUserRsvps)(userRecords);
        const keys = Object.keys(filtered);
        if (keys.length === 0)
            return [];
        const events = await this.db.events.getFlattenedEventsByIds(keys);
        const rsvps = this.parse.toRsvpShape(events, hash, filtered);
        return (0, rsvpSchema_1.RsvpSchemaArrayValidator)(rsvps);
    }
}
exports.ParticipationsService = ParticipationsService;
//# sourceMappingURL=participationsService.js.map