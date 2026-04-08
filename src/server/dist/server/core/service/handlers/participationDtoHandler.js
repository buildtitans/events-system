"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipationDtoHandler = void 0;
const schemaValidators_1 = require("../../lib/validation/schemaValidators");
class ParticipationDtoHandler {
    db;
    constructor(db) {
        this.db = db;
    }
    toRsvpShape(events, groupNameHash, statusLookup) {
        const results = events.map((event) => ({
            event_id: event.id,
            group_id: event.group_id,
            group_name: groupNameHash[event.group_id].name,
            starts_at: event.starts_at,
            starts_at_ms: event.starts_at_ms,
            scheduled_status: event.status,
            location: event.meeting_location,
            attendance_status: statusLookup[event.id],
            event_title: event.title,
            group_slug: groupNameHash[event.group_id].slug,
        }));
        return results;
    }
    async toUserMembershipShape(rawMemberships, rawGroups, lookupMap) {
        const groupIds = rawMemberships.map((m) => m.group_id);
        const memberCounts = await this.db.groupMembers.getMemberCountsByGroupIds(groupIds);
        const results = rawMemberships.map((membership) => {
            const group = rawGroups.find((grp) => grp.id === membership.group_id);
            return {
                group_id: membership.group_id,
                group_name: group?.name ?? "",
                location: group?.location ?? "",
                roleInGroup: membership.role,
                group_slug: group?.slug ?? "",
                member_count: memberCounts[membership.group_id] ?? 0,
                group_description: lookupMap[membership.group_id]?.group_description ?? "",
            };
        });
        return (0, schemaValidators_1.UserMembershipSchemaArrayValidator)(results);
    }
}
exports.ParticipationDtoHandler = ParticipationDtoHandler;
//# sourceMappingURL=participationDtoHandler.js.map