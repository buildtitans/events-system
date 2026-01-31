import { db } from "@/src/server/db";

type GroupsBySlug = Record<string, string>;

export async function seedGroupMembers(groupsBySlug: GroupsBySlug): Promise<void> {
    const groupIds = Object.values(groupsBySlug);

    if (groupIds.length === 0) {
        console.log("No groups provided to seedGroupMembers; skipping.");
        return;
    }

    const groups = await db
        .selectFrom("groups")
        .select(["id", "organizer_id"])
        .where("id", "in", groupIds)
        .execute();

    const organizerRows = groups
        .filter((g) => g.organizer_id !== null)
        .map((g) => ({
            group_id: g.id,
            user_id: g.organizer_id as string,
            role: "organizer",
        }));

    if (organizerRows.length === 0) {
        console.log("No organizer memberships to seed.");
        return;
    }

    await db
        .insertInto("group_members")
        .values(organizerRows)
        .onConflict((c) => c.columns(["group_id", "user_id"]).doNothing())
        .execute();

    console.log(`Seeded organizer memberships for ${organizerRows.length} groups`);
}
