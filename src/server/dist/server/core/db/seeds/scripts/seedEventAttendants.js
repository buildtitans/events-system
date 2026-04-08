"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEventAttendants = seedEventAttendants;
const db_1 = require("@/src/server/core/db/db");
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function sampleUnique(arr, count) {
    const copy = [...arr];
    const out = [];
    const n = Math.min(count, copy.length);
    for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        out.push(copy[idx]);
        copy.splice(idx, 1);
    }
    return out;
}
function pickStatus() {
    const r = Math.random();
    if (r < 0.75)
        return "going";
    if (r < 0.95)
        return "interested";
    return "not_going";
}
function initRows(events, membersByGroupId) {
    const rows = [];
    for (const event of events) {
        const eligibleUsers = membersByGroupId[event.group_id] ?? [];
        if (eligibleUsers.length === 0)
            continue;
        const maxCap = Math.min(eligibleUsers.length, 12);
        const minCap = eligibleUsers.length >= 4 ? 2 : 0;
        const attendeeCount = randomInt(minCap, maxCap);
        const chosenUsers = sampleUnique(eligibleUsers, attendeeCount);
        for (const userId of chosenUsers) {
            const status = pickStatus();
            if (status === "not_going")
                continue;
            rows.push({
                event_id: event.id,
                user_id: userId,
                status,
                created_at: new Date(),
                updated_at: null,
            });
        }
    }
    return rows;
}
async function seedEventAttendants(membersByGroupId) {
    const groupIds = Object.keys(membersByGroupId);
    if (groupIds.length === 0) {
        console.log("No membersByGroupId provided; skipping seedEventAttendants.");
        return;
    }
    // Pull events only for groups we know about
    const events = await db_1.db
        .selectFrom("events")
        .select(["id", "group_id"])
        .where("group_id", "in", groupIds)
        .execute();
    if (events.length === 0) {
        console.log("No events found for provided groups; skipping event attendants.");
        return;
    }
    const rows = initRows(events, membersByGroupId);
    if (rows.length === 0) {
        console.log("No attendant rows generated; nothing to insert.");
        return;
    }
    await db_1.db
        .insertInto("event_attendants")
        .values(rows)
        .onConflict((c) => c.columns(["event_id", "user_id"]).doNothing())
        .execute();
    console.log(`Seeded event attendants: inserted ~${rows.length} rows`);
}
//# sourceMappingURL=seedEventAttendants.js.map