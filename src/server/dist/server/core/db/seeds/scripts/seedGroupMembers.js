"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedGroupMembers = seedGroupMembers;
const db_1 = require("@/src/server/core/db");
async function insertMembers(db, organizerRows) {
    await db
        .insertInto("group_members")
        .values(organizerRows)
        .onConflict((c) => c.columns(["group_id", "user_id"]).doNothing())
        .execute();
}
async function getGroups(db, groupIds) {
    const groups = await db
        .selectFrom("groups")
        .select(["id", "organizer_id"])
        .where("id", "in", groupIds)
        .execute();
    return groups;
}
function buildOrganizerRows(groups, membersByGroupId) {
    const organizerRows = groups
        .filter((g) => g.organizer_id !== null)
        .map((g) => {
        membersByGroupId[g.id] = [g.organizer_id];
        const row = {
            group_id: g.id,
            user_id: g.organizer_id,
            role: "organizer",
        };
        return row;
    });
    return organizerRows;
}
async function seedGroupMembers(groupsBySlug) {
    const groupIds = Object.values(groupsBySlug);
    const membersByGroupId = {};
    if (groupIds.length === 0) {
        console.log("No groups provided to seedGroupMembers; skipping.");
        return membersByGroupId;
    }
    const groups = await getGroups(db_1.db, groupIds);
    const organizerRows = buildOrganizerRows(groups, membersByGroupId);
    if (organizerRows.length === 0) {
        console.log("No organizer memberships to seed.");
        return membersByGroupId;
    }
    await insertMembers(db_1.db, organizerRows);
    console.log(`Seeded organizer memberships for ${organizerRows.length} groups`);
    return membersByGroupId;
}
//# sourceMappingURL=seedGroupMembers.js.map