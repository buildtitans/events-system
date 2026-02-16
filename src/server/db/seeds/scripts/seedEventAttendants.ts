import { db } from "@/src/server/db/db";
import type { MembersByGroupId } from "./seedGroupMembers";
import type { EventAttendantsSchemaType } from "@/src/schemas/events/eventAttendantsSchema";

type AttendanceStatus = EventAttendantsSchemaType["status"];

type EventToAttend = {
    group_id: string;
    id: string;
};

type EventAttendantsRowType = {
    event_id: string;
    user_id: string;
    status: AttendanceStatus;
    created_at: Date;
    updated_at: Date | null;
};


function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sampleUnique<T>(arr: T[], count: number): T[] {
    const copy = [...arr];
    const out: T[] = [];

    const n = Math.min(count, copy.length);
    for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        out.push(copy[idx]);
        copy.splice(idx, 1);
    }
    return out;
}

function pickStatus(): AttendanceStatus {
    const r = Math.random();
    if (r < 0.75) return "going";
    if (r < 0.95) return "interested";
    return "not_going";
}


function initRows(events: EventToAttend[], membersByGroupId: MembersByGroupId): EventAttendantsRowType[] {

    const rows: Array<{
        event_id: string;
        user_id: string;
        status: AttendanceStatus;
        created_at: Date;
        updated_at: Date | null;
    }> = [];

    for (const event of events) {
        const eligibleUsers = membersByGroupId[event.group_id] ?? [];

        if (eligibleUsers.length === 0) continue;

        const maxCap = Math.min(eligibleUsers.length, 12);
        const minCap = eligibleUsers.length >= 4 ? 2 : 0;
        const attendeeCount = randomInt(minCap, maxCap);

        const chosenUsers = sampleUnique(eligibleUsers, attendeeCount);

        for (const userId of chosenUsers) {
            const status = pickStatus();

            if (status === "not_going") continue;

            rows.push({
                event_id: event.id,
                user_id: userId,
                status,
                created_at: new Date(),
                updated_at: null,
            });
        }
    }

    return rows
}


export async function seedEventAttendants(membersByGroupId: MembersByGroupId): Promise<void> {

    const groupIds = Object.keys(membersByGroupId);

    if (groupIds.length === 0) {
        console.log("No membersByGroupId provided; skipping seedEventAttendants.");
        return;
    }

    // Pull events only for groups we know about
    const events = await db
        .selectFrom("events")
        .select(["id", "group_id"])
        .where("group_id", "in", groupIds)
        .execute();

    if (events.length === 0) {
        console.log("No events found for provided groups; skipping event attendants.");
        return;
    }

    const rows: EventAttendantsRowType[] = initRows(events, membersByGroupId);

    if (rows.length === 0) {
        console.log("No attendant rows generated; nothing to insert.");
        return;
    }

    await db
        .insertInto("event_attendants")
        .values(rows)
        .onConflict((c) => c.columns(["event_id", "user_id"]).doNothing())
        .execute();

    console.log(`Seeded event attendants: inserted ~${rows.length} rows`);
};