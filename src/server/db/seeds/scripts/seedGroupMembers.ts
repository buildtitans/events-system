import { db } from "@/src/server/db";
import { DB, Groups } from "../../types/db";
import type { Kysely, Selectable } from "kysely";


export type MembersByGroupId = Record<string, string[]>;
type GroupsBySlug = Record<string, string>;
type SelectableGroup = Selectable<Groups>;
type GroupsSelected = Pick<SelectableGroup, "id" | "organizer_id">[];
type OrganizerRow = {
    group_id: string;
    user_id: string;
    role: "organizer";
}

type OrganizerRowsType = Array<OrganizerRow>;

async function insertMembers(db: Kysely<DB>, organizerRows: OrganizerRowsType): Promise<void> {
    await db
        .insertInto("group_members")
        .values(organizerRows)
        .onConflict((c) => c.columns(["group_id", "user_id"]).doNothing())
        .execute();
};

async function getGroups(db: Kysely<DB>, groupIds: string[]): Promise<GroupsSelected> {
    const groups = await db
        .selectFrom("groups")
        .select(["id", "organizer_id"])
        .where("id", "in", groupIds)
        .execute();

    return groups
};

function buildOrganizerRows(groups: GroupsSelected, membersByGroupId: MembersByGroupId): OrganizerRowsType {
    const organizerRows = groups
        .filter((g) => g.organizer_id !== null)
        .map((g) => {
            membersByGroupId[g.id] = [g.organizer_id as string];

            const row: OrganizerRow = {
                group_id: g.id,
                user_id: g.organizer_id as string,
                role: "organizer",
            };
            return row;
        });

    return organizerRows;
}

export async function seedGroupMembers(
    groupsBySlug: GroupsBySlug
): Promise<MembersByGroupId> {
    const groupIds = Object.values(groupsBySlug);

    const membersByGroupId: MembersByGroupId = {};

    if (groupIds.length === 0) {
        console.log("No groups provided to seedGroupMembers; skipping.");
        return membersByGroupId;
    }

    const groups = await getGroups(db, groupIds);

    const organizerRows = buildOrganizerRows(groups, membersByGroupId);

    if (organizerRows.length === 0) {
        console.log("No organizer memberships to seed.");
        return membersByGroupId;
    }

    await insertMembers(db, organizerRows);

    console.log(`Seeded organizer memberships for ${organizerRows.length} groups`);


    return membersByGroupId;
};
