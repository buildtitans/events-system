import { db } from "@/src/server/core/db";
import { DB, Groups } from "../../types/db";
import type { Kysely, Selectable } from "kysely";
import rawGroupMembers from "@/src/server/core/db/seeds/data/placeholder-group-members.json";

export type MembersByGroupId = Record<string, string[]>;
type GroupsBySlug = Record<string, string>;
type UsersByEmail = Record<string, string>;
type SelectableGroup = Selectable<Groups>;
type GroupsSelected = Pick<SelectableGroup, "id" | "organizer_id">[];
type GroupMemberSeed = {
  group: string;
  members: string[];
};
type GroupMemberRow = {
  group_id: string;
  user_id: string;
  role: "organizer" | "member";
};

type GroupMemberRows = GroupMemberRow[];

async function insertMembers(
  db: Kysely<DB>,
  rows: GroupMemberRows,
): Promise<void> {
  await db
    .insertInto("group_members")
    .values(rows)
    .onConflict((c) => c.columns(["group_id", "user_id"]).doNothing())
    .execute();
}

async function getGroups(
  db: Kysely<DB>,
  groupIds: string[],
): Promise<GroupsSelected> {
  const groups = await db
    .selectFrom("groups")
    .select(["id", "organizer_id"])
    .where("id", "in", groupIds)
    .execute();

  return groups;
}

function buildOrganizerRows(
  groups: GroupsSelected,
  membersByGroupId: MembersByGroupId,
): GroupMemberRows {
  const organizerRows = groups
    .filter((g) => g.organizer_id !== null)
    .map((g) => {
      membersByGroupId[g.id] = [g.organizer_id as string];

      const row: GroupMemberRow = {
        group_id: g.id,
        user_id: g.organizer_id as string,
        role: "organizer",
      };
      return row;
    });

  return organizerRows;
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function buildUsersByNormalizedEmail(
  usersByEmail: UsersByEmail,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(usersByEmail).map(([email, userId]) => [
      normalizeEmail(email),
      userId,
    ]),
  );
}

function buildMemberRows(
  groupsBySlug: GroupsBySlug,
  usersByEmail: UsersByEmail,
  membersByGroupId: MembersByGroupId,
): GroupMemberRows {
  const usersByNormalizedEmail = buildUsersByNormalizedEmail(usersByEmail);
  const rows: GroupMemberRows = [];

  for (const assignment of rawGroupMembers as GroupMemberSeed[]) {
    const groupId = groupsBySlug[assignment.group];

    if (!groupId) {
      throw new Error(
        `Unknown group slug in placeholder-group-members.json: ${assignment.group}`,
      );
    }

    const seededMembers = new Set(membersByGroupId[groupId] ?? []);
    membersByGroupId[groupId] ??= [];

    for (const email of assignment.members) {
      const userId = usersByNormalizedEmail[normalizeEmail(email)];

      if (!userId) {
        throw new Error(
          `Unknown user email in placeholder-group-members.json: ${email}`,
        );
      }

      if (seededMembers.has(userId)) {
        continue;
      }

      rows.push({
        group_id: groupId,
        user_id: userId,
        role: "member",
      });

      membersByGroupId[groupId].push(userId);
      seededMembers.add(userId);
    }
  }

  return rows;
}

export async function seedGroupMembers(
  groupsBySlug: GroupsBySlug,
  usersByEmail: UsersByEmail,
): Promise<MembersByGroupId> {
  const groupIds = Object.values(groupsBySlug);

  const membersByGroupId: MembersByGroupId = {};

  if (groupIds.length === 0) {
    console.log("No groups provided to seedGroupMembers; skipping.");
    return membersByGroupId;
  }

  const groups = await getGroups(db, groupIds);

  const organizerRows = buildOrganizerRows(groups, membersByGroupId);
  const memberRows = buildMemberRows(groupsBySlug, usersByEmail, membersByGroupId);
  const rows = [...organizerRows, ...memberRows];

  if (rows.length === 0) {
    console.log("No group memberships to seed.");
    return membersByGroupId;
  }

  await insertMembers(db, rows);

  console.log(
    `Seeded ${organizerRows.length} organizer memberships and ${memberRows.length} member memberships`,
  );

  return membersByGroupId;
}
